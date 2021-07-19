import React from 'react';
import styles from './SquareGrid.module.css';

interface Props {
    nbColumns: number;
    nbRows: number;
    children: React.ReactNode;
}

export default function SquareGrid({nbColumns, nbRows, children}: Props) {
    // TODO Reuse component from nerv-ui project
    return (
        <div className={styles.gridContainer} style={{"--nb-columns": nbColumns, "--nb-rows": nbRows}}>
            <div className={styles.grid}>
                {children}
            </div>
        </div>
      );
}
