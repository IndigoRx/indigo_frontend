import Link from "next/link";

type Buttonprops={
    href :string;
    buttonName : string;
};

export default function WhiteButton({href,buttonName}:Buttonprops){
    return<>
    <button className="px-4 py-2 rounded-md bg-white-700 text-green-700 hover:bg-green-700 hover:text-white transition">
        <Link href={href}>{buttonName}</Link>
    </button>
    </>
}