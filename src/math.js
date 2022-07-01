const calTip = (total, tipPer = .25) => total + (total * tipPer)

const fahrenheitToCelsius = (temp) => (temp -32) / 1.8

const celsiusToFahrenheit = (temp) => (temp * 1.8) + 32

const addFn= (a, b) => {
	return new Promise( (resolve, reject)=> {
		setTimeout( () => {
			resolve(a + b)
		}, 2000)
	})
}

module.exports = {
	calTip,
	fahrenheitToCelsius,
	celsiusToFahrenheit,
	addFn
}
