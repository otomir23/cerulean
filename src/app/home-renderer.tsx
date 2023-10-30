"use client";

import {useRef, useEffect} from "react";

function intRandomUpTo(max: number): number {
    return Math.floor(Math.random() * max)
}

export default function HomeRenderer() {
    const animationFrame = useRef<number>(-1);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const colors = ['#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa', '#1e40af'];
        const pixelSize = 16;

        const nextFrame = () => {
            animationFrame.current = requestAnimationFrame(render)
        };

        const render = () => {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) {
                ctx.globalAlpha = Math.random() * 0.1
                for (let y = 0; y < ctx.canvas.height; y += pixelSize) {
                    for (let x = 0; x < ctx.canvas.width; x += pixelSize) {
                        ctx.fillStyle = colors[intRandomUpTo(colors.length)];
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
                if (Math.random() > 0.98) {
                    ctx.globalAlpha = Math.random() * 0.5;
                    ctx.font = '1rem ' + ctx.canvas.computedStyleMap().get('font-family');
                    ctx.fillStyle = "white";
                    ctx.fillText(
                        [...Array(intRandomUpTo(24))].map(() => String.fromCharCode(intRandomUpTo(64) + 64)).join(''),
                        Math.random() * ctx.canvas.width,
                        Math.random() * ctx.canvas.height
                    );
                }
            }
            nextFrame();
        }

        nextFrame();
        return () => cancelAnimationFrame(animationFrame.current);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(({target}) => {
                const c = target as HTMLCanvasElement
                if (c.height != target.clientHeight || c.width != target.clientWidth) {
                    c.height = c.clientHeight
                    c.width = c.clientWidth
                }
            })
        })
        resizeObserver.observe(canvasRef.current)

        return () => resizeObserver.disconnect();
    }, [])

    return <canvas ref={canvasRef} className="w-full h-96 rounded-md" />
}