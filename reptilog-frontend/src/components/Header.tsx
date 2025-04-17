export default function Header() {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-16 bg-white z-40"></div>
            <div className="fixed top-0 z-50 w-full px-4 py-4">
                <div className="mx-auto max-w-[90rem]">
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-8 py-2">
                        <a href="/" className="flex items-center gap-2 group">
                            <img
                                src="/reptilog-icon.png"
                                alt="Reptilog"
                                width={32}
                                height={32}
                                className="h-9 w-9 transition-opacity group-hover:opacity-75"
                            />
                            <span className="text-lg font-semibold transition-colors group-hover:text-gray-500">reptilog</span>
                        </a>

                        <div className="hidden items-center gap-8 sm:flex">
                            <nav className="flex items-center gap-6">
                                <a href="https://github.com/giovabattelli/reptilog-full" target="_blank" className="text-sm text-gray-700 transition-colors hover:text-gray-500">GitHub ↗</a>
                            </nav>

                            <a href="https://greptile.com" target="_blank" className="group flex items-center rounded-md border border-emerald-500 bg-emerald-100 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-emerald-50">
                                <span className="transition-colors group-hover:text-gray-700">Inspired by Greptile</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-5 w-5 transition-all group-hover:text-gray-700 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>

                        <button className="sm:hidden" aria-label="Toggle menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}