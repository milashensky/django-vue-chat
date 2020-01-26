<script>
const MAX_PADDING = 2
export default {
    functional: true,
    props: {
        total: {
            type: Number,
            required: true
        },
        page: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: true
        },
        setPage: {
            type: Function,
            required: true
        }
    },
    render (createElement, context) {
        const pages = Math.ceil(context.props.total / context.props.perPage)
        let pagesBefore = []
        let pagesAfter = []
        for (let i = 0; i < pages; i++) {
            if (i < context.props.page)
                pagesBefore.push(i)
            if (i > context.props.page)
                pagesAfter.push(i)
        }
        let children = []
        function buildChildLink (i, handler) {
            if (i === undefined) return
            let ops = {
                class: 'link'
            }
            if (i === context.props.page)
                ops.class = 'link active'
            if (handler)
                ops.on = {click: () => handler(i)}
            children.push(createElement('a', ops, [i + 1]))
        }
        buildChildLink(pagesBefore.shift(), context.props.setPage)
        if (pagesBefore.length > MAX_PADDING)
            children.push(createElement('div', {class: 'dots'}, ['...']))
        pagesBefore.reverse().slice(0, MAX_PADDING).reverse().forEach(i => {
            buildChildLink(i, context.props.setPage)
        })
        buildChildLink(context.props.page)
        pagesAfter.splice(0, MAX_PADDING).forEach(i => {
            buildChildLink(i, context.props.setPage)
        })
        if (pagesAfter.length > MAX_PADDING)
            children.push(createElement('div', {class: 'dots'}, ['...']))
        buildChildLink(pagesAfter.pop(), context.props.setPage)
        const current = context.props.page * context.props.perPage + 1
        let upper = current + context.props.perPage - 1
        if (upper > context.props.total)
            upper = context.props.total
        children.push(createElement('div', {class: 'info'}, [`Showed ${current} - ${upper} of ${context.props.total}`]))
        return createElement('div', {class: 'pagination'}, children)
    }
}
</script>

<style lang="css" scoped>
.pagination {
    display: flex;
    flex-flow: row nowrap;
}
.pagination .dots,
.pagination  .link {
    padding: 7px 14px;
    margin-right: 10px;
    box-shadow: 0 0 10px 0px #ced4da;
    background-color: white;
    cursor: pointer;
    border: 0;
    outline: 0;
}
.pagination .link {
    cursor: pointer;
}
.pagination .link:hover {
    box-shadow: 0 0 25px 2px #ced4da;
    background-color: #e1e2e46b
}
.pagination .link.active {
    background-color: #e1e2e46a
}
.pagination .info {
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
