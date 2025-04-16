'use client'

import { BlurFade } from "./magicui/blur-fade"

export default function Footer() {
    return (
        <BlurFade delay={0.25} duration={0.4} inView>
            <footer className="w-full py-6 text-center text-sm text-gray-600">
                <p>© 2025 Giovanni Assad. All rights reserved.</p>
            </footer>
        </BlurFade>
    )
}
