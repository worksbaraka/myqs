import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-[#f9f0df] rounded-b-3xl px-10 py-14">
      
      {/* Left side */}
      <div className="max-w-lg space-y-6">
        {/* Cartoon worker avatar + bubble */}
        <div className="flex items-start gap-3">
          <Image
            src="/worker-cartoon.png" // <-- put your cartoon worker image in /public
            alt="Cartoon Worker"
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <div className="bg-green-900 text-white font-bold text-2xl px-4 py-2 rounded-xl inline-block">
              Welcome to myQS
            </div>
            <div className="bg-green-900 text-white text-lg px-4 py-4 rounded-xl mt-2">
              Delivering comprehensive quantity surveying solutions across all
              sectors of the built environment with precision, integrity, and
              innovation.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-6 pt-4">
          <button className="bg-black text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800">
            Get Demo
          </button>
          <button className="bg-black text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800">
            Join
          </button>
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="mt-10 md:mt-0">
        <Image
          src="/worker-helmet.jpg" // <-- put your real image in /public
          alt="Worker in Helmet"
          width={500}
          height={500}
          className="rounded-3xl shadow-lg"
        />
      </div>
    </section>
  );
}