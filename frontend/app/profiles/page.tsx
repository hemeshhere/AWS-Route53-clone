import { Settings, Plus } from "lucide-react";

export default function ProfilesPage() {
  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal text-gray-900 mb-1">Profiles</h1>
          <p className="text-sm text-gray-500">
            Manage Route 53 Profiles to share DNS configurations across your organization.
          </p>
        </div>
        <button className="bg-[#ec7211] hover:bg-[#eb5f07] text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors">
          Create profile
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 text-gray-600 p-4 rounded-full mb-4">
          <Settings size={32} />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          You have not created any profiles. Create a profile to group DNS configurations and associate them with multiple VPCs.
        </p>
        <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-50 text-gray-900 font-bold text-sm py-1.5 px-4 rounded-sm transition-colors">
          <Plus size={16} />
          Create profile
        </button>
      </div>
    </div>
  );
}