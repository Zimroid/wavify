import {CSSProperties} from 'react';
declare module "react" {
    interface CSSProperties {
	"--x"?: number;
	"--y"?: number;
	"--nb-columns"?: number;
	"--nb-rows"?: number;
	"--path"?: string;
	"--color"?: string;
    }
}
