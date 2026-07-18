export default function AdminDashboardPage() {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
  
          <h1 className="text-3xl font-bold text-gray-800">
            ROOTYM Admin Dashboard
          </h1>
  
          <p className="text-gray-500 mt-2">
            Welcome back, Administrator.
          </p>
  
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
  
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500 text-sm">Total Enquiries</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
  
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500 text-sm">New Enquiries</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
  
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500 text-sm">Contact Messages</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
  
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500 text-sm">Newsletter Subscribers</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
  
          </div>
  
          {/* Recent Enquiries */}
          <div className="bg-white rounded-xl shadow mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Enquiries
            </h2>
  
            <p className="text-gray-500">
              No enquiries available.
            </p>
          </div>
  
        </div>
      </main>
    );
  }