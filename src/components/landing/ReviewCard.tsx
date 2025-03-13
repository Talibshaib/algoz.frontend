import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee"; 
import { MotionDiv } from "@/components/ui/motion";
import { Star } from "lucide-react";

// More realistic and diverse testimonials
const reviews = [
  {
    name: "Michael Chen",
    username: "@mchen_trader",
    body: "AlgoZ has completely transformed my trading workflow. The TradingView integration is seamless and the automated strategies have consistently outperformed my manual trades.",
    img: "https://avatar.vercel.sh/mchen",
    rating: 5,
    position: "Professional Trader"
  },
  {
    name: "Sarah Johnson",
    username: "@sarahj",
    body: "As someone new to algorithmic trading, I was worried about the learning curve. AlgoZ made it incredibly simple to get started, and their customer support is exceptional.",
    img: "https://avatar.vercel.sh/sarahj",
    rating: 5,
    position: "Retail Investor"
  },
  {
    name: "David Rodriguez",
    username: "@drodriguez",
    body: "The API integration capabilities are outstanding. I've been able to connect all my trading accounts and automate my entire strategy with minimal effort.",
    img: "https://avatar.vercel.sh/drodriguez",
    rating: 4,
    position: "Software Engineer"
  },
  {
    name: "Emma Wilson",
    username: "@emma_trades",
    body: "I've tried several algorithmic trading platforms, and AlgoZ stands out for its reliability and performance. Haven't experienced any downtime in 6 months of daily use.",
    img: "https://avatar.vercel.sh/emma",
    rating: 5,
    position: "Hedge Fund Analyst"
  },
  {
    name: "Raj Patel",
    username: "@raj_fintech",
    body: "The marketplace for trading strategies is a game-changer. I've found several profitable strategies that have significantly improved my portfolio's performance.",
    img: "https://avatar.vercel.sh/raj",
    rating: 5,
    position: "FinTech Consultant"
  },
  {
    name: "Olivia Martinez",
    username: "@olivia_m",
    body: "AlgoZ's webhook system is incredibly powerful. I've been able to create custom notifications and automations that have saved me countless hours of monitoring.",
    img: "https://avatar.vercel.sh/olivia",
    rating: 4,
    position: "Day Trader"
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
  rating,
  position
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  rating: number;
  position: string;
}) => {
  return (
    <MotionDiv
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <figure
        className={cn(
          "relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border p-6 mx-2",
          // light styles
          "border-gray-200 bg-white shadow-sm hover:border-gray-300",
          // dark styles
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        )}
      >
        <div className="flex flex-row items-center gap-3 mb-3">
          <img 
            className="rounded-full border-2 border-gray-100" 
            width="48" 
            height="48" 
            alt={`${name}'s avatar`} 
            src={img} 
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-semibold text-gray-900">
              {name}
            </figcaption>
            <p className="text-xs text-gray-500">{position}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
            />
          ))}
        </div>
        
        <blockquote className="mt-2 text-sm text-gray-700 leading-relaxed">"{body}"</blockquote>
        
        <p className="mt-4 text-xs font-medium text-blue-600">{username}</p>
      </figure>
    </MotionDiv>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <div className="mb-10 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-black bg-opacity-5 text-sm font-medium text-gray-800 mb-3">
          TESTIMONIALS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
      </div>
      
      <Marquee pauseOnHover className="[--duration:30s] mb-8">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
    </div>
  );
}
