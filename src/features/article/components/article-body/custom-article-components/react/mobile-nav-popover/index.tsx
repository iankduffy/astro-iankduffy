import { VscMenu } from "react-icons/vsc";
import style from './mobile-nav.module.scss'

export function MobileNavPopover() {
    return <section className="grid place-items-center py-8">
        <button popovertarget="article-mobile-menu" className="button"><span className="flex gap-4"><VscMenu className="text-2xl" /> <span>Menu</span></span></button>
        <div popover='auto' id="article-mobile-menu" className={style.mobileMenuPopover}>
            <button popovertarget="article-mobile-menu" popovertargetaction="hide" className="button danger">Close</button>
            <nav>
                <p>Mobile Menu Appears Here</p>
            </nav>
        </div>
    </section>
}