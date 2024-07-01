import Image from "next/image"
import Link from "next/link"

const Birthdays = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Aniversários</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="https://images.pexels.com/photos/11163069/pexels-photo-11163069.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <span className="font-semibold">Hugo Cicillini</span>
        </div>
        <div className="flex gap-3 justify-end">
          <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">Celebrar</button>
        </div>
      </div>
      <div className="p-4 bg-slate-100 rounded-lg flex items-center gap-4">
        <Image src="/gift.png" alt="" width={24} height={24} />
        <Link href="" className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700 font-semibold">Próximos Aniversários</span>
          <span className="text-gray-500">Veja os próximos 10 aniversários</span>
        </Link>
      </div>
    </div>
  )
}

export default Birthdays