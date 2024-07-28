import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex gap-x-2">
      <Image height={42} width={42} alt="logo" src={"/logo.svg"} />
      <h1 className="text-3xl text-sky-700 font-bold font-mono">Lorem.</h1>
    </div>
  );
};

export default Logo;
