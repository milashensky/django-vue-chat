HTMLElement.prototype.isChild = function (el) {
    return this.parentElement && (this.parentElement === el || (this.parentElement.isParent && this.parentElement.isChild(el)))
}

export const toggle = {
    bind (el, binding, vnode) {
        el.addEventListener('click', () => {
            el.classList.toggle(binding.expression)
        })
        document.addEventListener('click', (e) => {
            if (e.target !== el && !e.target.isChild(el))
                el.classList.remove(binding.expression)
        })
    }
}
