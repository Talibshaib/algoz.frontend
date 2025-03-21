import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee"; 
import { MotionDiv } from "@/components/ui/motion";
import { Star } from "lucide-react";
import { Card, CardBody, Avatar } from "@nextui-org/react";

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

interface ReviewCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const ReviewCard = ({ name, role, content, rating, image }: ReviewCardProps) => {
  return (
    <Card 
      className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      radius="lg"
    >
      <CardBody className="p-6">
        {/* Rating Stars */}
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "text-amber-500 fill-amber-500" : "text-gray-600"}
            />
          ))}
        </div>
        
        {/* Review Content */}
        <p className="text-gray-300 mb-6 text-sm">"{content}"</p>
        
        {/* Reviewer Info */}
        <div className="flex items-center">
          <Avatar
            src={image}
            className="mr-3"
            size="sm"
          />
          <div>
            <p className="text-white font-medium text-sm">{name}</p>
            <p className="text-gray-400 text-xs">{role}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <div className="mb-10 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-black bg-opacity-5 text-sm font-medium text-gray-800 mb-3">
          TESTIMONIALS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
      </div>
      
      <Marquee pauseOnHover className="[--duration:30s] mb-8">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} name={review.name} role={review.position} content={review.body} rating={review.rating} image={review.img} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} name={review.name} role={review.position} content={review.body} rating={review.rating} image={review.img} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-950"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-950"></div>
    </div>
  );
}
