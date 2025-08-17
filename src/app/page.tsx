import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 justify-between p-8">
        <div className="flex-1 flex flex-col items-start">
          <div className="bg-green-800 text-white p-4 rounded-lg mb-4">
            <h1 className="text-3xl font-bold">Welcome to myQS</h1>
            <p className="mt-2">Delivering comprehensive quantity surveying solutions across all sectors of the built environment with precision, integrity, and innovation.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-black text-white px-6 py-2 rounded-full">Get Demo</button>
            <button className="bg-black text-white px-6 py-2 rounded-full">Join</button>
          </div>
        </div>
        <div className="flex-1 bg-gray-800">
          <div className="h-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}