
export function BasicPopover() {
    return <section className="grid place-items-center py-8">
        <button popovertarget="basic-popover" className="button flex">Click Here To Open Popover</button>
        <div popover='auto' id="basic-popover">
            <p>This is a basic popover</p>
            <p>With it default styles minus the close button. The popover opens in the center of the screen, pressing esc or clicking outside the popover will close it.</p>
            <button popovertarget="basic-popover" popovertargetaction="hide" className="button danger">Close</button>
        </div>
    </section>
}