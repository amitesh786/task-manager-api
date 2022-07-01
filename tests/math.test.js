const { calTip, fahrenheitToCelsius, celsiusToFahrenheit, addFn  } = require('../src/math')

test('Should calculate total with tip', () => {
	expect(calTip(5, .2)).toBe(6);
});


test('Should calculate total with default tip', () => {
	expect(calTip(5)).toBe(6.25);
});

test('Should convert 32 F to 0 C', () => {
	expect(fahrenheitToCelsius(32)).toBe(0);
});


test('Should convert 0 C to 32 F', () => {
	expect(celsiusToFahrenheit(0)).toBe(32);
});

// test('Async test demo', () => {
// 	expect(1).toBe(2);
// })

test('Should add 2 number', (done) => {
	addFn(2, 3).then( (sum) => {
		expect(sum).toBe(5)
		done()
	})
})

test('Should add 2 number async/wait', async() => {
	const sum = await addFn(2, 3);
	expect(sum).toBe(5)	
})

