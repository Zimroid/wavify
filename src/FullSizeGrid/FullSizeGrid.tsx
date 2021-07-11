import SquareGrid from '../SquareGrid/SquareGrid';
import useScreenSize from '../useScreenSize/useScreenSize';
import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode
}

export default function FullSizeGrid({ children }: Props) {
  const { width: widthScreen, height: heightScreen } = useScreenSize();
  const [grid, setgrid] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (widthScreen > heightScreen) {
        const height = 50;
        setgrid({ width: Math.round(widthScreen / heightScreen * height), height });
    } else {
        const width = 50;
        setgrid({ width, height: Math.round(heightScreen / widthScreen * width) });
    }
  }, [widthScreen, heightScreen])

  return (
    <SquareGrid nbColumns={grid.width} nbRows={grid.height}>
        {children}
    </SquareGrid>
  );
}