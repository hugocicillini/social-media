import Image from 'next/image';

const Ads = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      <div className="flex items-center justify-between text-gray-500 font-medium">
        <span>Anúncios Patrocinados</span>
        <Image src="/more.png" alt="" width={16} height={16} />
      </div>
      <div
        className={`flex flex-col mt-4 ${size === 'sm' ? 'gap-2' : 'gap-4'}`}
      >
        <div
          className={`relative w-full ${
            size === 'sm' ? 'h-24' : size === 'md' ? 'h-36' : 'h-48'
          }`}
        >
          <Image
            src="https://images.ctfassets.net/wfutmusr1t3h/4az9qJsmDqojZqmUffRGvw/f8c7b8ac48a85439f478dee3d991a1d7/1200x630-AI-Blog-LIGHT_2x.png?w=1280&q=75"
            alt=""
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/250px-GitHub_Invertocat_Logo.svg.png"
            alt=""
            width={24}
            height={24}
            className="rounded-full w-6 h-6 object-cover"
          />
          <span className="text-blue-500 font-medium">Github</span>
        </div>
        <p className={`${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {size === 'sm'
            ? 'lorem ipsun dolor sit amet consectur adisiplinig elit'
            : size === 'md'
            ? 'We invite everyone to a captivating morning of discovery, designed to demystify the future of software development.'
            : 'We invite everyone to a captivating morning of discovery, designed to demystify the future of software development. Youll hear from leading experts, connect with fellow innovators, and leave with a clear vision of the road ahead.'}
        </p>
        <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">
          Saiba mais
        </button>
      </div>
    </div>
  );
};

export default Ads;
