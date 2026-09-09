"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, uploadProfileImage } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";
import { getImageFileError } from "@/utils/validators";
import Avatar from "@/components/Avatar";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  // --- Edit profile (firstname/lastname) ---
  const [profileForm, setProfileForm] = useState({ firstname: "", lastname: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileServerError, setProfileServerError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ firstname: user.firstname, lastname: user.lastname });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileServerError("");
    setProfileSuccess("");

    const validationErrors = {};
    if (!profileForm.firstname.trim()) validationErrors.firstname = "First name is required";
    if (!profileForm.lastname.trim()) validationErrors.lastname = "Last name is required";
    setProfileErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSavingProfile(true);
    try {
      await updateProfile({ firstname: profileForm.firstname.trim(), lastname: profileForm.lastname.trim() });
      await refreshProfile();
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileServerError(getErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  // --- Profile image upload ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleChooseImage = () => fileInputRef.current?.click();

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    setImageError("");
    setImageSuccess("");
    if (!file) return;

    const validationError = getImageFileError(file);
    if (validationError) {
      setImageError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setImageError("");
    setIsUploadingImage(true);
    try {
      await uploadProfileImage(selectedFile);
      // Refreshes the shared AuthContext user, so the Navbar avatar updates
      // immediately too — no logout/login required (Rules #22).
      await refreshProfile();
      setImageSuccess("Profile image updated successfully.");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setImageError(getErrorMessage(err));
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!user) return null;

  const fullName = `${user.firstname} ${user.lastname}`;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Image</h2>

        {imageError && (
          <div className="mb-4">
            <ErrorAlert message={imageError} />
          </div>
        )}
        {imageSuccess && (
          <div className="mb-4">
            <SuccessAlert message={imageSuccess} />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Avatar src={previewUrl ? null : user.profileImage} name={fullName} size={72} />
          {previewUrl && (
            // Local object URL preview — not from the API, so Avatar's asset
            // helper doesn't apply; render it directly.
            <img src={previewUrl} alt="Preview" className="h-[72px] w-[72px] rounded-full object-cover" />
          )}

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelected}
              className="hidden"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleChooseImage}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Choose Image
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploadingImage}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingImage ? "Uploading..." : "Upload"}
              </button>
            </div>
            {selectedFile && <p className="text-xs text-gray-500">{selectedFile.name}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Information</h2>

        {profileServerError && (
          <div className="mb-4">
            <ErrorAlert message={profileServerError} />
          </div>
        )}
        {profileSuccess && (
          <div className="mb-4">
            <SuccessAlert message={profileSuccess} />
          </div>
        )}

        <form onSubmit={handleProfileSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstname"
              value={profileForm.firstname}
              onChange={handleProfileChange}
              error={profileErrors.firstname}
            />
            <FormInput
              label="Last Name"
              name="lastname"
              value={profileForm.lastname}
              onChange={handleProfileChange}
              error={profileErrors.lastname}
            />
          </div>

          <FormInput label="Email" value={user.email} disabled readOnly className="opacity-70" />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
              {user.role}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
