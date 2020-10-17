<template>
    <div class="tool-management">
        <div class="step text-center" v-if="step == 0">
            <h3>Vai começar os estudos de hoje?</h3>
            <p>Utilize a Ferramenta de Gestão de Tempo e melhore sua produtividade!</p>

            <i class="fas fa-stopwatch primary"></i>

            <button class="btn-blue-rounded" @click="step++">Vamos lá!</button>
        </div>

        <div class="step text-center" v-else-if="step == 1">
            <p>
                Esta ferramenta se baseia na Técnica de Pomodoro, que consiste<br>
                em dividir o tempo em períodos de 25 minutos, com breves intervalos.
            </p>
            <label for="tempo">Portanto, determine o período de Intervalo de tempo entre os estudos</label>
            <select id="tempo" name="tempo" class="data-input" v-model="breakInterval">
                <option value="05" selected>5 minutos</option>
                <option value="10">10 minutos</option>
                <option value="15">15 minutos</option>
            </select>

            <button class="btn-blue-rounded" @click="step++">Avançar</button>
        </div>

        <div class="step text-center" v-else-if="step == 2">
            <audio id="notification-sound">
                <source src="../../assets/audio/notification-sound.mp3" type="audio/mpeg">
            </audio>

            <div v-if="status == 'startingStudies'">
                <p>Intervalo finalizado!</p>
                <h5>Clique no botão abaixo para recomeçar os Estudos</h5>
            </div>

            <div v-else-if="status == 'studying'">
                <p>Estudando...</p>
                <h5>Você pode clicar no botão abaixo para interromper os estudos e forçar um Intervalo</h5>
            </div>

            <div v-else-if="status == 'startingBreak'">
                <p>Tempo de Estudo Finalizado!</p>
                <h5>Clique no botão abaixo para começar o Intervalo</h5>
            </div>

            <div v-else-if="status == 'duringBreak'">
                <p>Fazendo o intervalo...</p>
                <h5>Você pode clicar no botão abaixo para finalizar o Intervalo</h5>
            </div>

            <div v-else>
                <h5>Bons estudos!</h5>
                <p>Clique no botão quando for começar</p>
                <p>Não se preocupe, pois quando o tempo acabar, você será alertado com um som!</p>
            </div>


            <h1 class="timer">
                <i class="fas fa-stopwatch primary"></i> {{ timer }}
            </h1>

            <i class="far fa-hourglass primary" v-if="hourglass == 0"></i>
            <i class="fas fa-hourglass-start primary" v-if="hourglass == 1"></i>
            <i class="fas fa-hourglass-half primary" v-if="hourglass == 2"></i>
            <i class="fas fa-hourglass-end primary" v-if="hourglass == 3"></i>

            <button class="btn-blue-rounded" @click="startStudies" v-if="buttonFunction == 'startStudies'">Iniciar Estudos</button>
            <button class="btn-blue-rounded" @click="showBreakInterval" v-else-if="buttonFunction == 'forceBreakInterval'">Forçar Intervalo</button>
            <button class="btn-blue-rounded" @click="startBreakInterval" v-else-if="buttonFunction == 'startBreakInterval'">Iniciar Intervalo</button>
            <button class="btn-blue-rounded" @click="showStartStudies" v-else-if="buttonFunction == 'forceStudies'">Finalizar Intervalo</button>
        </div>

        

    </div>
</template>

<script>
export default {
    name: 'timeManagementTool',
    data: function() {
        return {
            step: 0,
            status: "",
            studiesTime: "25",
            breakInterval: "05",
            timer: "00:25:00",
            hourglass: 0,
            temporizador: null,
            buttonFunction: "startStudies"
        }
    },
    methods: {
        startStudies() {
            this.status = "studying"
            this.buttonFunction = "forceBreakInterval"

            var horaDezena = '0'
            var horaUnidade = '0'
            var minutoDezena = '0'
            var minutoUnidade = '0'
            var segundoDezena = '0'
            var segundoUnidade = '0'

            const regex = new RegExp(/(\d\d):(\d\d):(\d\d)/)
            var timeStart = new Date();
            const studyTime = new Date();
            studyTime.setMinutes(timeStart.getMinutes() + parseInt(this.studiesTime));
            const scheduleTarget = regex.exec(studyTime)

            var count = 0
            this.temporizador = setInterval(() => {
                const now = new Date()
                const target = new Date()
                target.setHours(scheduleTarget[1])
                target.setMinutes(scheduleTarget[2])
                target.setSeconds(scheduleTarget[3])

                const differenceinMili = target.getTime() - now.getTime()
                if (differenceinMili >= 0) {
                    const difference = regex.exec(new Date(differenceinMili).toISOString())

                    horaDezena = difference[1][0]
                    horaUnidade = difference[1][1]
                    minutoDezena = difference[2][0]
                    minutoUnidade = difference[2][1]
                    segundoDezena = difference[3][0]
                    segundoUnidade = difference[3][1]

                    var timeLeft = `${horaDezena}${horaUnidade}:${minutoDezena}${minutoUnidade}:${segundoDezena}${segundoUnidade}`
                    this.timer = timeLeft
                } else {
                    this.showBreakInterval()
                }

                count++;
                if(Math.round((this.studiesTime * 60) / 2) == count) {
                    this.hourglass = 2
                }
            }, 1000)
            this.hourglass = 1
        },
        showBreakInterval() {
            this.hourglass = 3
            this.stop()
            this.timer = `00:${this.breakInterval}:00`
            this.status = "startingBreak"
            this.buttonFunction = "startBreakInterval"
            document.getElementById('notification-sound').play()
        },
        startBreakInterval() {
            this.status = "duringBreak"
            this.buttonFunction = "forceStudies"

            var horaDezena = '0'
            var horaUnidade = '0'
            var minutoDezena = '0'
            var minutoUnidade = '0'
            var segundoDezena = '0'
            var segundoUnidade = '0'

            const regex = new RegExp(/(\d\d):(\d\d):(\d\d)/)
            var timeStart = new Date();
            const breakTime = new Date();
            breakTime.setMinutes(timeStart.getMinutes() + parseInt(this.breakInterval));
            const scheduleTarget = regex.exec(breakTime)

            var count = 0
            this.temporizador = setInterval(() => {
                const now = new Date()
                const target = new Date()
                target.setHours(scheduleTarget[1])
                target.setMinutes(scheduleTarget[2])
                target.setSeconds(scheduleTarget[3])

                const differenceinMili = target.getTime() - now.getTime()
                if (differenceinMili >= 0) {
                    const difference = regex.exec(new Date(differenceinMili).toISOString())

                    horaDezena = difference[1][0]
                    horaUnidade = difference[1][1]
                    minutoDezena = difference[2][0]
                    minutoUnidade = difference[2][1]
                    segundoDezena = difference[3][0]
                    segundoUnidade = difference[3][1]

                    var timeLeft = `${horaDezena}${horaUnidade}:${minutoDezena}${minutoUnidade}:${segundoDezena}${segundoUnidade}`
                    this.timer = timeLeft
                } else {
                    this.showStartStudies()
                }

                count++;
                if(Math.round((this.breakInterval * 60) / 2) == count) {
                    this.hourglass = 2
                }
            }, 1000)
            this.hourglass = 1
        },
        showStartStudies() {
            this.hourglass = 3
            this.stop()
            this.timer = `00:${this.studiesTime}:00`
            this.status = "startingStudies"
            this.buttonFunction = "startStudies"
            document.getElementById('notification-sound').play()
        },
        stop() {
            clearInterval(this.temporizador)
        }
    },
    beforeDestroy() {
        this.stop()
    }
}
</script>

<style scoped>
    .tool-management {
        width: 100%;
        padding: 0px 15px;
    }

    .tool-management .step {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .tool-management .step i {
        font-size: 10rem;
        margin-top: 10px;
    }

    .tool-management .step button {
        width: auto;
        padding: 5px 25px;
        margin-top: 25px;
        border-radius: 50px;
    }

    .tool-management .step select {
        width: auto;
        padding: 5px 15px;
        border-radius: 50px;
    }

    .tool-management .step .timer i {
        font-size: 3rem;
    }
</style>