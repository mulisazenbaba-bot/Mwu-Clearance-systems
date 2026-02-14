export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MWU Clearance System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Online Clearance System for Madda Walabu University
        </p>
        <div className="space-y-4">
          <a 
            href="/login" 
            className="block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Access System
          </a>
          <p className="text-sm text-gray-500">
            Please contact your system administrator for login credentials.
          </p>
        </div>
      </div>
    </div>
  );
}