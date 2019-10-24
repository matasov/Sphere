import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'wripetext'
})
export class WripetextPipe implements PipeTransform {
    transform(text: string, context: CanvasRenderingContext2D, width: number): string {
        let maxWidth = width - 5;
        let startText = text + "...";
        let startWidth = context.measureText(text).width;
        let currentWidth = startText.length;
        if (startWidth > maxWidth) {
            currentWidth = Math.floor(currentWidth * (maxWidth) / startWidth);
            while (context.measureText(startText.substr(0, currentWidth) + "...").width > maxWidth) {
                currentWidth--;
            }
            return startText.substr(0, currentWidth) + "...";
        }
        else return text;
    }

    getTextWidth(text, font) {
        // re-use canvas object for better performance
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
    }
}