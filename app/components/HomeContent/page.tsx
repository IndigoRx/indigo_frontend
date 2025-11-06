import Image from "next/image";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function HomeContent() {
  const items = [
    {
      image: "/images/logo/test.jpg",
      description:
        "Patient Management: Keep all patient records organized and accessible, so you can provide personalized care without the clutter.",
    },
    {
      image: "/images/logo/test.jpg",
      description:
        "Prescription Tracking: Create, update, and manage prescriptions digitally, reducing errors and saving time.",
    },
    {
      image: "/images/logo/test.jpg",
      description:
        "Analytics & Reports: Gain insights into patient trends and treatment outcomes to make informed decisions faster.",
    },
  ];

  return (
    // Use min-h-screen and remove justify-between to avoid large distributed gaps
    <div className="min-h-screen overflow-hidden flex flex-col px-4">
      {/* Header (fixed natural height) */}
      <header className="flex-none flex flex-col items-center pt-8 pb-2">
        <h1 className="text-lg md:text-xl font-medium text-gray-700 text-center mb-1">
          Download now
        </h1>
        <h1 className="text-2xl md:text-4xl text-green-700 text-center font-semibold mb-2">
          Streamline Patient Care, Effortlessly
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            className="flex items-center bg-black text-white rounded-lg px-3 py-2 hover:opacity-90 transition-all"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            <Image
              src="/images/logo/appstore.png"
              alt="App Store"
              width={26}
              height={26}
              className="mr-2"
            />
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-[9px]">Download on the</span>
              <span className="text-xs font-semibold">App Store</span>
            </div>
          </button>

          <button
            className={`flex items-center bg-black text-white rounded-lg px-3 py-2 hover:opacity-90 transition-all ${roboto.className}`}
          >
            <Image
              src="/images/logo/playstore.png"
              alt="Google Play"
              width={30}
              height={30}
              className="mr-2"
            />
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-[9px]">Get it on</span>
              <span className="text-xs font-medium">Google Play</span>
            </div>
          </button>
        </div>
      </header>

      {/* Green section: also flex-none so it doesn't get pushed down by flex spacing.
          Use responsive top margin: on small screens push it down, on md/lg keep it close. */}
<section className="w-full bg-green-700 pt-3 pb-6 mt-4 md:mt-0">
  <div className="w-full text-center text-white">
    <h2 className="text-base md:text-2xl font-bold mb-3 mt-5">
      EXPLORE THE FEATURES OF INDIGORX
    </h2>

    {/* Flex layout - vertical on small screens, horizontal on larger ones */}
    <div className="flex flex-col md:flex-row flex-wrap justify-center items-start gap-4 md:gap-6">

      {/* Card 1 */}
      <div
        className="relative rounded-lg overflow-hidden shadow-sm group
                   flex-none w-11/12 sm:w-3/4 md:basis-[28%] md:max-w-60
                   mx-auto md:mx-0
                   h-80 sm:h-80 md:h-72
                   mb-3 md:mb-0"
      >
        <img
          src="/images/logo/test.jpg"
          alt="feature-1"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs md:text-sm text-center">
          <p>
            Patient Management: Keep all patient records organized and accessible...
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div
        className="relative rounded-lg overflow-hidden shadow-sm group
                   flex-none w-11/12 sm:w-3/4 md:basis-[28%] md:max-w-60
                   mx-auto md:mx-0
                   h-80 sm:h-80 md:h-72
                   mb-3 md:mb-0"
      >
        <img
          src="/images/logo/test.jpg"
          alt="feature-2"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs md:text-sm text-center">
          <p>
            Prescription Tracking: Create, update, and manage prescriptions digitally...
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div
        className="relative rounded-lg overflow-hidden shadow-sm group
                   flex-none w-11/12 sm:w-3/4 md:basis-[28%] md:max-w-60
                   mx-auto md:mx-0
                   h-80 sm:h-80 md:h-72
                   mb-3 md:mb-0"
      >
        <img
          src="/images/logo/test.jpg"
          alt="feature-3"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs md:text-sm text-center">
          <p>
            Analytics & Reports: Gain insights into patient trends and treatment outcomes...
          </p>
        </div>
      </div>

    </div>
  </div>
</section>










      {/* Optional: if you want a footer area, add a flex-none footer here */}
    </div>
  );
}
