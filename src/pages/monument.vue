<template>
    <header>
        <nav>
            <label>
                <select @change="changeMonument">
                    <option :value="item.id" v-for="item in monumentStore.monument">{{ item.title }}</option>
                </select>
            </label>
            <label>简繁
                <select v-model="Gconfig.show_type" @change="changeShowType">
                    <option value="繁">繁</option>
                    <option value="简">简</option>
                    <option value="对比">对比</option>
                </select>
            </label>
            <!-- <label>字体
                <select name="" id="fontFamily">
                    <option value="防宋">防宋</option>
                    <option value="赵孟頫楷书">赵孟頫楷书</option>
                    <option value="欧阳询书法字体">欧阳询书法字体</option>
                    <option value="田英章毛笔楷书">田英章毛笔楷书</option>
                </select>
            </label> -->
            <label>大小<input type="range" min="12" max="72" v-model="Gconfig.font_size" @change="changeFontSize"></label>
        </nav>
    </header>

    <main id="main" :style="{ 'font-size': Gconfig.font_size + 'px' }">
        <p :class="Gconfig.class_tradi_p" v-if="Gconfig.show_type == '对比' | Gconfig.show_type == '繁'">{{
        monumentStore.get(monumentId).originTradi
}}</p>
        <p :class="Gconfig.class_simp_p" v-if="Gconfig.show_type == '对比' | Gconfig.show_type == '简'">{{
        monumentStore.get(monumentId).originSimp
}}</p>
    </main>
    <div id="summary" v-show="state.length - state.no_repeate_len > 0">
        <h3 class="summary">
            全文共{{ state.length }}字，重复字{{ state.length - state.no_repeate_len }}个，
            非重复字{{ state.no_repeate_len }}字。重复次数如下：
        </h3>
        <table class="info" cellspacing="0">
            <tr class="t-head">
                <th>重复字</th>
                <th v-for="item in charOccurrence">{{ item[1] }}</th>
            </tr>
            <tr class="t-body">
                <td>重复次数</td>
                <td v-for="item in charOccurrence">{{ item[0] }}</td>
            </tr>
        </table>
    </div>
    <br>
    <div>
        <h3>《千字文》内的字{{ state.compare_qzw[0].size }}个：</h3>
        <p class="cp-qzw"><span v-for="item in state.compare_qzw[0]">{{ item }}</span></p>
        <h3>不在《千字文》内的字{{ state.compare_qzw[1].size }}个：</h3>
        <p class="cp-qzw"><span v-for="item in state.compare_qzw[1]">{{ item }}</span></p>
    </div>
</template>
<script setup>

import { computed, reactive, ref } from 'vue';
import { useMonumentStore } from '@/stores/monument';


const monumentStore = useMonumentStore()
let monumentId = ref('mys')
document.title = '湖州妙嚴寺記'
const state = reactive({
    length: 0,
    no_repeate_len: 0,
    compare_qzw: monumentStore.isInQzw('mys')
})
const Gconfig = reactive({
    show_type: '繁',
    font_family: '',
    font_size: '24px',
    class_tradi_p: 'tradi-p',
    class_simp_p: 'simp-p'
})
const charOccurrence = computed(() => {
    const tradiCharSet = new Set() // 用于过滤重复的字
    const charMap = new Map() //单字出现次数
    const regx = /[　，。、：；？！「」『』\s]/g
    const pureChar = monumentStore.get(monumentId.value).originTradi.replace(regx, "") // 用正则去除标点
    pureChar.split('').forEach(item => {
        if (tradiCharSet.has(item)) {
            if (charMap.has(item)) {
                let count = charMap.get(item)
                charMap.set(item, ++count)
            } else {
                charMap.set(item, 2)
            }
        } else {
            tradiCharSet.add(item)
        }
    })
    state.length = pureChar.length
    state.no_repeate_len = tradiCharSet.size
    return sortMap(charMap)
})

function changeMonument(e) {
    const { value } = e.target
    monumentId.value = value
    document.title = monumentStore.get(value).title
    state.compare_qzw = monumentStore.isInQzw(value)
}

function changeFontSize() {
    if (Gconfig.font_size >= 24) {
        Gconfig.class_simp_p = 'none'
        Gconfig.class_tradi_p = 'single-p'
    } else {
        Gconfig.class_simp_p = 'simp-p'
        Gconfig.class_tradi_p = 'tradi-p'
    }
}
function changeShowType() {
    if (Gconfig.show_type == '简') {
        Gconfig.class_simp_p = ''
    } else {
        Gconfig.class_simp_p = 'simp-p'
    }
}

function sortMap(map) {
    const sortedMap = new Map([...map].sort((a, b) => b[1] - a[1]))
    const resultMap = new Map()
    sortedMap.forEach((v, k) => {
        if (resultMap.has(v)) {
            resultMap.set(v, resultMap.get(v) + k)
        } else {
            resultMap.set(v, k)
        }
    })

    return resultMap
}
</script>
<style scoped>
header {
    height: 40px;
    width: 80%;
    display: flex;
    justify-content: center;
}

main {
    background-color: antiquewhite;
    font-family: SimSun, "楷体", fangsong;
    font-weight: bold;
    max-height: 80vh;
    letter-spacing: 3px;
    writing-mode: tb-rl;
    text-overflow: ellipsis;
    position: relative;
    padding: 9px;
}

p {
    padding: 15px;
    line-height: 4;
}

.tradi-p {
    text-decoration: underline seagreen;
}

.single-p {
    line-height: 1.5;
}

.simp-p {
    position: absolute;
    right: 33px;
}

.cp-qzw {
    line-height: 1.5;
    letter-spacing: 6px;
    font-size: 16px;
    margin: 0;
}

nav {
    font-family: SimSun;
    height: 30px;
    width: 60%;
    padding: 4px;
    left: 20%;
    border: 1px sandybrown solid;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
}

td,
th {
    border: 1px solid seagreen;
    padding: 5px;
    letter-spacing: 8px;
    text-align: center;
}

.none {
    display: none;
}
</style>