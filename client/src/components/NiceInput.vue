<template>
    <div class="nice-input">
        <input :name="name"
            :type="type"
            :value="value"
            class="nice-input"
            ref="input"
            :class="[valid == true ? 'valid' : '', valid === false ? 'invalid': '']"
            :placeholder="placeholder" @input="$emit('input', $event.target.value)">
        <p class="nice-placeholder">
            <span>{{ placeholder }}</span>
            <span class="required" v-if="required">*</span>
        </p>
    </div>
</template>

<script>

export default {
    props: ['value', 'placeholder', 'name', 'type', 'valid', 'required']
}
</script>
<style scoped>
.nice-input {
    width: 100%;
    position: relative;
}
.nice-input .required {
    color: red;
}
.nice-input input.invalid {
    box-shadow: 0 0 10px 0px #da3c3ca3;
}
.nice-input .nice-placeholder {
    margin: 0;
    position: absolute;
    top: 1rem;
    color: #969696;
    left: 15px;
    font-size: 1rem;
    transition: all 0.3s ease;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    letter-spacing: 0.5px;
    pointer-events: none;
    text-transform: capitalize;
}

.nice-input input:not(:placeholder-shown)~.nice-placeholder,
.nice-input input:active~.nice-placeholder,
.nice-input input:focus~.nice-placeholder {
    top: 5px;
    font-size: 0.8rem;
    color: #969696;
}

.nice-input input::-moz-placeholder {
    color: #fff;
    opacity: 0;
}

.nice-input input:-moz-placeholder {
    color: #fff;
    opacity: 0;
}

.nice-input input::-webkit-input-placeholder {
    color: #fff;
    opacity: 0;
}

.nice-input input:-ms-input-placeholder {
    color: #fff;
    opacity: 0;
}

.nice-input input::placeholder {
    color: #fff;
    opacity: 0;
}

.nice-input input {
    height: 3.3rem;
    box-sizing: border-box;
    padding: 18px 10px 2px 15px;
    font-size: 1rem;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    box-shadow: 0 0 10px 0px #ced4da;
    border: 0;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
