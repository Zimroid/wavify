import React from 'react';
import styles from './SquareCell.module.css';

interface Props {
    x: number;
    y: number;
    children: React.ReactNode;
}

export default function SquareCell({x, y, children}: Props) {
// let a:number = "toto";
    return (
        <div className={styles.cellWrapper} style={{"--x": x, "--y": y, color: "red"}}>
            <div className={styles.cell}>
                {children}
            </div>
        </div>
      );
}
