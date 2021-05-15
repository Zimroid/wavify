import './App.css';
import styles from './App.module.css';
import SquareGrid from './SquareGrid/SquareGrid';
import SquareCell from './SquareCell/SquareCell';
import Wave from './Wave/Wave';
import { useState } from 'react';

function App() {
  const intensity = 50;
  const maxLength = 60;

  // TODO to refactor

  const zeroFiller = (text, nbChar) => {
    let res = text;
    while (res.length < nbChar) {
      res = `0${res}`;
    }
    return res;
  };

  const hexaToColor = (hexa) => {
    return `#${zeroFiller(hexa.r, 2)}${zeroFiller(hexa.g, 2)}${zeroFiller(hexa.b, 2)}${zeroFiller(hexa.a, 2)}`
  }

  const computeColorAndGreyLvlForPartImage = (left, right, top, bottom, canvas) => {
    const nbValues = (right - left) * (bottom - top);
    const somme = {r: 0, g: 0, b: 0, a: 0};
    for (let i = left; i < right; i++) {
      for (let j = top; j < bottom; j++) {
        const rawColor = canvas.getContext('2d').getImageData(i, j, 1, 1).data;
        somme.r += rawColor[0];
        somme.g += rawColor[1];
        somme.b += rawColor[2];
        somme.a += rawColor[3];
      }
    }
    const average = {
      r: Math.round(somme.r / nbValues),
      g: Math.round(somme.g / nbValues),
      b: Math.round(somme.b / nbValues),
      a: Math.round(somme.a / nbValues),
    }
    const hexa = {
      r: average.r.toString(16),
      g: average.g.toString(16),
      b: average.b.toString(16),
      a: average.a.toString(16),
    }

    return {
      color: hexaToColor(hexa),
      grey: (average.r + average.g + average.b) / 3,
    };
  }

  const gridFiller = (gridWidth, gridHeight, canvas) => {
    const listCell = [];
    const canvasElementWidth = canvas.width / gridWidth;
    const canvasElementHeight = canvas.height / gridHeight;
    
    let darkest = 255;
    let brightest = 0;

    for(let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        const left = Math.round(canvasElementWidth * i);
        const right = Math.round(left + canvasElementWidth - 1);
        const top = Math.round(canvasElementHeight * j);
        const bottom = Math.round(top + canvasElementHeight - 1);
        const {color, grey} = computeColorAndGreyLvlForPartImage(left, right, top, bottom, canvas);
  
        listCell.push({
          x: i,
          y: j,
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

    return listCell.map(cell => {
      const nbPeriod = Math.round((cell.grey - darkest) / (brightest - darkest) * 4);
      return <SquareCell x={cell.x} y={cell.y}>
        <Wave nbPeriod={nbPeriod === 0 ? 1 : nbPeriod} intensity={nbPeriod === 0 ? 0 : intensity} color={cell.color}></Wave>
      </SquareCell>
    });
  }

  const [grid, setGrid] = useState({width: 0, height: 0});
  const [cells, setCells] = useState();

  const loaded = (image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

    let gridWidth = 0;
    let gridHeight = 0; 
    if (image.width > image.height) {
      const coef = image.width / maxLength;
      gridWidth = maxLength;
      gridHeight = Math.round(image.height / coef);
    } else {
      const coef = image.height / maxLength;
      gridWidth = Math.round(image.width / coef);
      gridHeight = maxLength;
    }
    setGrid({width: gridWidth, height: gridHeight});

    setCells(gridFiller(gridWidth, gridHeight, canvas));
    canvas.remove();
  }

  const handleImageLoad = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => { loaded(img) };
    }
    reader.readAsDataURL(event.target.files[0]);
  }


  return (
    <div className={styles.demoWrapper}>
      <div className={styles.demoSource}>
        <input type="file" id="imageLoader" name="imageLoader" onChange={handleImageLoad}/>
      </div>
      <div className={styles.demo}>
        <div className={styles.demoGrid}>
          <div className={styles.demoGridWrapper}>
            <SquareGrid nbColumns={grid.width} nbRows={grid.height}>
              {cells}
            </SquareGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
