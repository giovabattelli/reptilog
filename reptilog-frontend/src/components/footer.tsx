'use client'

import { BlurFade } from "./magicui/blur-fade"

export default function Footer() {
    return (
        <BlurFade delay={0.25} duration={0.4} inView>
            <footer className="w-full py-6 text-center text-sm text-gray-600">
                <p>
                    © 2025 Made by <a
                        href="https://giovabattelli.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-500 transition-colors underline underline-offset-2"
                    >
                        Giovanni Assad
                    </a>.
                </p>
            </footer>
        </BlurFade>
    )
}
