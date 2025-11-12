
type Cardprops = { 
  image: string;
  description : string;
};

export default function ImageCard({image,description} : Cardprops) {
  return (
    <div className="relative w-50 h-70 rounded-2xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <img
        src={image}
        alt="Card background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content at bottom left */}
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-sm opacity-90"> {description}</p>
      </div>
    </div>
  );
}
