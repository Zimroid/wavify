import { box, color, imageWavified, WaveConfig } from "../type";

/** To get a string of at least given size by puting zeros at the left */
export function fillStringWithZero(originalText: string, nbCharInOutput: number): string {
  let res = originalText;
  while (res.length < nbCharInOutput) {
    res = `0${res}`;
  }
  return res;
};

/** To get a string usable as a css color */
export function colorObjectToHexa(colorObject: color): string {
  return `#${fillStringWithZero(colorObject.r, 2)}${fillStringWithZero(colorObject.g, 2)}${fillStringWithZero(colorObject.b, 2)}${fillStringWithZero(colorObject.a, 2)}`
}

/** To get the avergage color and the greyscale of a pixel array */
export function computeAverageColorAndGreyLvlFromPixelsArray(pixelsToCompute: Uint8ClampedArray[]): {color: string, grey: number} {
  const pixelSommeByColorComposant = {r: 0, g: 0, b: 0, a: 0};
  pixelsToCompute.forEach(pixel => {
    pixelSommeByColorComposant.r += pixel[0];
    pixelSommeByColorComposant.g += pixel[1];
    pixelSommeByColorComposant.b += pixel[2];
    pixelSommeByColorComposant.a += pixel[3];
  });
  const averageColor = {
    r: Math.round(pixelSommeByColorComposant.r / pixelsToCompute.length),
    g: Math.round(pixelSommeByColorComposant.g / pixelsToCompute.length),
    b: Math.round(pixelSommeByColorComposant.b / pixelsToCompute.length),
    a: Math.round(pixelSommeByColorComposant.a / pixelsToCompute.length),
  }
  const avergageColorInHexa = {
    r: averageColor.r.toString(16),
    g: averageColor.g.toString(16),
    b: averageColor.b.toString(16),
    a: averageColor.a.toString(16),
  }

  return {
    color: colorObjectToHexa(avergageColorInHexa),
    grey: (averageColor.r + averageColor.g + averageColor.b) / 3,
  };
}

/** Reduce a two dimensional pixel array from a given canvas to a single dimension array */
export function partImageToArray(boundaries: box, canvas: HTMLCanvasElement): Uint8ClampedArray[] {
  const pixelsToCompute = [];
  for (let i = boundaries.left; i < boundaries.right; i++) {
    for (let j = boundaries.top; j < boundaries.bottom; j++) {
      const tmp = canvas.getContext('2d')
      if (tmp) {
        const originalPixel = tmp.getImageData(i, j, 1, 1).data;
        pixelsToCompute.push(originalPixel);
      }
    }
  }

  return pixelsToCompute;
}

/** To get the avergage color and the greyscale of a given canvas part */
export function computeColorAndGreyLvlForPartImage(boundaries: box, canvas: HTMLCanvasElement): {color: string, grey: number} {
  const pixelsToCompute = partImageToArray(boundaries, canvas);
  return computeAverageColorAndGreyLvlFromPixelsArray(pixelsToCompute);
}

/** To get the boundary coordinates */
export function computeSubImageBoundaries(top: number, left: number, height: number, width: number): box {
  return {
    left: Math.round(left),
    right: Math.round(left + width - 1),
    top: Math.round(top),
    bottom: Math.round(top + height - 1),
  }
}

/** To get a the config of all waves generated by the given canvas */
export function getListWaveConfigFromCanvas(drawedImageWidth: number, drawedImageHeight: number, canvas: HTMLCanvasElement, gridWidth: number, gridHeight: number): imageWavified {
  const listWaveConfig: WaveConfig[] = [];
  
  const canvasSubPartWidth = canvas.width / drawedImageWidth;
  const canvasSubPartHeight = canvas.height / drawedImageHeight;
  
  let darkest = 255;
  let brightest = 0;

  const borderTopHeight = Math.round((gridHeight - drawedImageHeight) / 2);
  const borderLeftWidth = Math.round((gridWidth - drawedImageWidth) / 2);

  for(let i = 0; i < drawedImageWidth; i++) {
    for (let j = 0; j < drawedImageHeight; j++) {
      const boundaries = computeSubImageBoundaries(canvasSubPartHeight * j, canvasSubPartWidth * i, canvasSubPartHeight, canvasSubPartWidth)
      const {color, grey} = computeColorAndGreyLvlForPartImage(boundaries, canvas);

      listWaveConfig.push({
        x: i + borderLeftWidth,
        y: j + borderTopHeight,
        color: color,
        grey: grey,
      });

      if (darkest > grey) {
        darkest = grey;
      }
      if (brightest < grey) {
        brightest = grey;
      }
    }
  }

  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < borderTopHeight; j++) {
      listWaveConfig.push({
        x: i,
        y: j,
        color: '#424242',
        grey: darkest,
      });
    }
  }
  
  for (let i = 0; i < gridWidth; i++) {
    for (let j = borderTopHeight + drawedImageHeight; j < gridHeight; j++) {
      listWaveConfig.push({
        x: i,
        y: j,
        color: '#424242',
        grey: darkest,
      });
    }
  }
  
  for (let i = 0; i < borderLeftWidth; i++) {
    for (let j = borderTopHeight; j < borderTopHeight + drawedImageHeight; j++) {
      listWaveConfig.push({
        x: i,
        y: j,
        color: '#424242',
        grey: darkest,
      });
    }
  }
  
  for (let i = borderLeftWidth + drawedImageWidth; i < gridWidth; i++) {
    for (let j = borderTopHeight; j < borderTopHeight + drawedImageHeight; j++) {
      listWaveConfig.push({
        x: i,
        y: j,
        color: '#424242',
        grey: darkest,
      });
    }
  }

  const listWaveConfigSorted = listWaveConfig.sort((a, b) => {
    if (a.x === b.x) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });

  return { id: Date.now(), listWave: listWaveConfigSorted, darkest, brightest };
}

/** Create an hidden canvas and display the given image */
export function createHiddenCanvasFromImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const tmp = canvas.getContext('2d');
  if (tmp) {
    tmp.drawImage(image, 0, 0, image.width, image.height);
  }

  return canvas;
}

/** To get the grid size based on the image proportion and the max grid size */
export function computeDrawedGridSizeFromImage({width: originalImgageWidth, height: originalImageHeight}: {width: number, height: number}, outputImageWidth: number, outputImageHeight: number): { drawedImageWidth: number, drawedImageHeight: number } {
  let drawedImageWidth = 0;
  let drawedImageHeight = 0;

  if (originalImgageWidth > originalImageHeight) {
    const coef = originalImgageWidth / outputImageWidth;
    drawedImageWidth = outputImageWidth;
    drawedImageHeight = Math.round(originalImageHeight / coef);
  } else {
    const coef = originalImageHeight / outputImageHeight;
    drawedImageWidth = Math.round(originalImgageWidth / coef);
    drawedImageHeight = outputImageHeight;
  }

  return { drawedImageWidth, drawedImageHeight };
}

/** To get a list of wave component to display in grif from a given image */
export function getListWaveFromImage(image: HTMLImageElement, width: number, height: number): imageWavified {
  const canvas = createHiddenCanvasFromImage(image);
  const { drawedImageWidth, drawedImageHeight } = computeDrawedGridSizeFromImage(image, width, height);

  const imgWavified = getListWaveConfigFromCanvas(drawedImageWidth, drawedImageHeight, canvas, width, height);
  canvas.remove();

  return imgWavified;
}