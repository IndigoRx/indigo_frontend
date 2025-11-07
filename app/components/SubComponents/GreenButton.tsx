import Link from "next/link";

type Buttonprops={
    href :string;
    buttonName : string;
};

export default function GreenButton({href,buttonName}:Buttonprops){
    return<>
    <button className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-white hover:text-green-700 transition">
        <Link href={href}>{buttonName}</Link>
    </button>
    </>
}