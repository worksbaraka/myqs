import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8">
        <div className="flex-1 flex flex-col items-start max-w-md mb-6 md:mb-0">
          <div className="bg-green-800 text-white p-4 md:p-6 rounded-lg mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">Welcome to myQS</h1>
            <p className="mt-2 text-base md:text-lg text-center md:text-left">Delivering comprehensive quantity surveying solutions across all sectors of the built environment with precision, integrity, and innovation.</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <button className="bg-black text-white px-6 py-2 rounded-full text-base w-full md:w-auto">Get Demo</button>
            <button className="bg-black text-white px-6 py-2 rounded-full text-base w-full md:w-auto">Join</button>
          </div>
        </div>
        <div className="flex-1 mt-6 md:mt-0 md:ml-6 w-full md:w-auto">
          <Image
            src="/image.jpg"
            alt="Construction worker"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
            style={{ maxHeight: 'calc(100vh - 200px)', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}