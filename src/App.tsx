import './App.css';
import styles from './App.module.css';
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import useTick from './useTick/useTick';
import WavifiedImage from './WavifiedImage/WavifiedImage';
import { imageWavified } from './type';
import { getListWaveFromImage } from './WavifiedImage/WavifyUtils';
import useScreenSize from './useScreenSize/useScreenSize';
import SquareGrid from './SquareGrid/SquareGrid';

export default function App() {
  /** The vertical size of the waves */
  const intensity = 50;

  /** The number of waves for the longest side of the image */
  const maxLength = 60;

  const delayTick = useRef(1);
  const tickCanStart = useRef(false);

  const defaultImageWavified: imageWavified = {
    id: 0,
    listWave: [],
    darkest: 0,
    brightest: 100
  };

  /** The list of wavified image to display */
  const [imageWavified, setImageWavified] = useState(defaultImageWavified);

  const defaultListImagesWavified: imageWavified[] = []

  /** The list of wavified image available to display */
  const [listImagesWavified, setListImagesWavified] = useState(defaultListImagesWavified);

  /** The index of the current image displayed from images */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { width: widthScreen, height: heightScreen } = useScreenSize();
  const [grid, setgrid] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (widthScreen > heightScreen) {
      const width = maxLength;
      setgrid({ width, height: Math.round(heightScreen / widthScreen * width) });
    } else {
      const height = maxLength;
      setgrid({ width: Math.round(widthScreen / heightScreen * height), height });
    }
  }, [widthScreen, heightScreen]);

  /** To display the given wavified image */
  const displayWavifiedImage = (imgWavified: imageWavified) => {
    setImageWavified(imgWavified);
  }

  useEffect(() => {
    if (imageWavified.id === 0 && listImagesWavified.length > 0 && !tickCanStart.current) {
      displayWavifiedImage(listImagesWavified[0]);
      tickCanStart.current = true;
    }
  }, [listImagesWavified])

  /** To add the given wavified image to the images list */
  const addWavifiedImageToImagesList = (imgWavified: imageWavified) => {
    const newImages = [...listImagesWavified];
    newImages.push(imgWavified);
    setListImagesWavified(newImages);
  }

  /** To handle a new image loaded */
  const imgLoaded = (image: HTMLImageElement) => {
    const imgWavified = getListWaveFromImage(image, grid.width, grid.height);
    addWavifiedImageToImagesList(imgWavified);
  }

  /** To handle an image from an input file */
  const handleImageLoadFromInput = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        const tmp = e.target;
        if (tmp) {
          img.src = `${tmp.result}`;
        }
        img.onload = () => { imgLoaded(img) };
    }
    const tmp = event.target.files;
    if (tmp) {
      reader.readAsDataURL(tmp[0]);
    }
  }

  /** To handle an image from an img html balise */
  const handleImageLoadFromImgBalise = (image: SyntheticEvent<HTMLImageElement, Event>) => {
    imgLoaded(image.target as HTMLImageElement);
  }

  /** To display the next image in the images list */
  const displayNextImage = () => {
    if (listImagesWavified.length > 1) {
      const newImageIndex = (currentImageIndex + 1) % listImagesWavified.length;
      if (listImagesWavified[currentImageIndex].id !== listImagesWavified[newImageIndex].id) {
        setCurrentImageIndex(newImageIndex);
        displayWavifiedImage(listImagesWavified[newImageIndex]);
      } else {
        setCurrentImageIndex(newImageIndex);
        displayNextImage();
      }
    }
  }

  /** To display a new image every 10 seconds */
  useTick(() => {
    if (tickCanStart) {
      if (delayTick.current === 0) {
        displayNextImage();
      }
      else {
        delayTick.current = delayTick.current - 1;
      }
    }
  }, 10000);

  return (
    <div className={styles.demoFullSize}>
      <img src="image.jpg" onLoad={handleImageLoadFromImgBalise} className={styles.hideImgTest} alt="test"></img>
      <img src="link.jpg" onLoad={handleImageLoadFromImgBalise} className={styles.hideImgTest} alt="test"></img>
      <img src="mona.jpg" onLoad={handleImageLoadFromImgBalise} className={styles.hideImgTest} alt="test"></img>
      <SquareGrid nbColumns={grid.width} nbRows={grid.height}>
        <WavifiedImage imageConfig={imageWavified} intensity={intensity}></WavifiedImage>
      </SquareGrid>
      <input type="file" id="imageLoader" name="imageLoader" className={styles.inputTest} onChange={handleImageLoadFromInput}/>
    </div>
  );
}