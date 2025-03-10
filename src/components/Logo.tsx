
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/" className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <div className="h-8 w-8 border-2 border-fhhabitat flex items-center justify-center">
          <div className="h-5 w-5 flex flex-wrap">
            <div className="h-2 w-2 bg-fhhabitat m-[0.5px]"></div>
            <div className="h-2 w-2 bg-fhhabitat m-[0.5px]"></div>
            <div className="h-2 w-2 bg-fhhabitat m-[0.5px]"></div>
            <div className="h-2 w-2 bg-fhhabitat m-[0.5px]"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-fhhabitat text-xl">FH Habitat</span>
        <span className="text-xs text-maprimerenov">MaPrimeRénov'</span>
      </div>
    </Link>
  );
};

export default Logo;
