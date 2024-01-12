import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex gap-x-2">
      <Image height={60} width={60} alt="logo" src={"/logo.svg"} />
      <h1 className="text-3xl text-sky-800 font-bold font-mono">Lorem.</h1>
    </div>
  );
};

export default Logo;
