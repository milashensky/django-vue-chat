<template functional>
    <div class="nav">
        <a class="home" href="/">
            Home
        </a>
        <a class="burger-btn" v-toggle="active">
            <span/>
        </a>
        <ul class="nav-links">
            <li>
                <router-link :to="{ name: 'Profile' }">Profile</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'Chat' }">Chat</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'Users' }">Users</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'Logout' }">Logout</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.nav {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: space-between;
    box-shadow: 0 0 15px 0 #e3e3e3;
    margin-bottom: 20px;
}
.nav-links {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: flex-end;
    list-style: none;
    padding: 0;
    margin: 0;

}
.nav li {
    display: flex;
}
.nav a {
    transition: all .3s ease;
    padding: 20px;
    text-decoration: none;
    cursor: pointer;
    color: #4d4e50;
}
.nav-links a.active-exact {
    background-color: #ececec;
}
.nav-links a:hover {
    background-color: #e3e3e3;
}
.nav .home {
    margin-right: auto;
}
.burger-btn {
    position: relative;
    padding: 20px 15px;
    width: 65px;
    display: none;
}
.burger-btn span::after,
.burger-btn span::before,
.burger-btn span {
    content: '';
    position: absolute;
    height: 3px;
    width: 25px;
    background-color: #4d4e50;
    border-radius: 5px;
    opacity: 1;
    transition: all .1s linear;
}
.burger-btn span {
    top: calc(50% - 8px);
}
.burger-btn span::before {
    top: calc(50% + 5px);
}
.burger-btn span::after {
    top: calc(50% + 12px);
}
.burger-btn.active span::before{
    opacity: 0;
}
.burger-btn.active span::after {
    transform: rotate(-90deg) translate(14.5px, -.5px);
    top: calc(50% + 13px);
}
.burger-btn.active {
    background-color: #ececec;
}
.burger-btn.active span {
    transform: rotate(45deg);
    top: calc(50% - 2px);
}
@media (max-width: 480px) {
    .nav {
        flex-wrap: wrap;
        position: relative;
        z-index: 100;
    }
    .burger-btn {
        display: block;
    }
    .nav-links {
        position: absolute;
        width: 100%;
        flex-flow: column nowrap;
        transform: translateY(-100%);
        pointer-events: none;
        opacity: 0;
        box-shadow: 0 8px 8px 0 #e3e3e3;
        background-color: white;
        top: -250px;
        transition: all .3s ease;
    }
    .nav-links a {
        width: 100%;
    }
    .burger-btn.active ~ .nav-links {
        top: 58px;
        z-index: 50;
        transform: translateY(0px);
        pointer-events: all;
        opacity: 1;
    }
}
</style>
