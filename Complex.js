'use strict';
var Complex = function(number){
	this.re = this.im = 0;
	if(typeof number == "string"){ // If is a complex number definitios (A+Bi)
		if(/(i|j)/.test(number.toString())){
			if(/(\d+|\d+(\.\d+))(\+|\-)((\d+|\d+(\.\d+)))(i|j)/g.test(number.toString())){
				var separado = number.toString().replace(/(\d+|\d+(\.\d+))(\+|\-)((\d+|\d+(\.\d+)))(i|j)/g, "$1,$2,$3,$4").split(",");
				this.re = Complex.analiza(separado[0]);
				if(separado[2] == "-"){
					this.im = -Complex.analiza(separado[3]);
				}else{
					this.im = Complex.analiza(separado[3]);
				}
			}else{
				if(!isNaN(parseFloat(number))){
					this.im = parseFloat(number);
				}	
			}
		}else{
			if(!isNaN(parseFloat(number))){
				this.re = parseFloat(number);
			}
		}
	}else if(!isNaN(number)){
		this.re = number;
	}else if(typeof number === "object"){
		if(number.re !== undefined){
			this.re = number.re;
		}

		if(number.im !== undefined){
			this.im = number.im;
		}
	}
	this.real = function(){ return this.re; }
	this.imag = function(){ return this.im; }
	this.toString = function(){
		return this.re.toString()+((this.im<0)? this.im : "+"+this.im)+"i";
	}
}


Complex.prototype.add = function(cmplx){
	if(cmplx.constructor.name === "Complex"){
		return new Complex({re: (this.real()+cmplx.re), im: (this.imag()+cmplx.im)});
	}else{
		if(cmplx.constructor.name === "Number"){
			return new Complex({re: (this.real()+cmplx), im: this.imag()});
		}
	}
}

Complex.prototype.sub = function(cmplx){
	if(cmplx.constructor.name === "Complex"){
		return new Complex({re: (this.real()-cmplx.re), im: (this.imag()-cmplx.im)});
	}else{
		if(cmplx.constructor.name === "Number"){
			return new Complex({re: (this.real()-cmplx), im: this.imag()});
		}
	}
}

Complex.prototype.conj = function(){
	return new Complex({re: this.real(), im: -this.imag()});
}

Complex.prototype.mul = function(cmplx){
	if(cmplx.constructor.name === "Complex"){
		return new Complex({re: (this.real()*cmplx.re-this.imag()*cmplx.im), im: (this.imag()*cmplx.re+this.real()*cmplx.im)});
	}else{
		if(cmplx.constructor.name === "Number"){
			return new Complex({re: (this.real()*cmplx), im: (this.imag()*cmplx)});
		}
		if(cmplx.constructor.name === "String"){
			return Complex.prototype.mul(new Complex(cmplx));
		}
	}
}

Complex.prototype.div = function(cmplx){	// this/cmplx
	if(cmplx.constructor.name === "Complex"){
		var _d = cmplx.re*cmplx.re+cmplx.im*cmplx.im;

		return new Complex({re: (this.real()*cmplx.re+this.imag()*cmplx.im)/_d, im: (this.imag()*cmplx.re-this.real()*cmplx.im)/_d});
	}else{
		if(cmplx.constructor.name === "Number"){
			return new Complex({re: (this.real()/cmplx), im: (this.imag()/cmplx)});
		}
		if(cmplx.constructor.name === "String"){
			return this.div(new Complex(cmplx));
		}
	}
}

Complex.exp = function(cmplx){
	if(cmplx.constructor.name === "Complex"){
		var a = Math.exp(cmplx.re);
		return new Complex({re: (a*Math.cos(cmplx.im)), im: (a*Math.sin(cmplx.im))});
	}else{
		if(cmplx.constructor.name === "Number"){
			return new Complex({re: Math.exp(cmplx)});
		}
	}
}

Complex.sin = function(cmplx){
	return new Complex({re: Math.sin(cmplx.re)*Math.cosh(cmplx.im), im: Math.cos(cmplx.re)*Math.sinh(cmplx.im)});
}

Complex.cos = function(cmplx){
	return new Complex({re: Math.cos(cmplx.re)*Math.cosh(cmplx.im), im: -Math.sin(cmplx.re)*Math.sinh(cmplx.im)});
}

Complex.tan = function(cmplx){
	return Complex.sin(cmplx).div(Complex.cos(cmplx));
}

/**
function: Complex.sqrt
	Returns the square root of a complex number.
*/

Complex.sqrt = function(cmplx){
	if("Complex"===cmplx.constructor.name){
		var r, theta, sqr;
		r=cmplx.abs();
		theta=cmplx.angle();
		sqr=Math.sqrt(r);
		return new Complex({re: sqr*Math.cos(theta/2), im: sqr*Math.sin(theta/2)});	
	}
	if("Number"===cmplx.constructor.name){
		if(cmplx<0){
			return new Complex({re: 0, im: Math.sqrt(cmplx)});	
		}else{
			return new Complex({re: Math.sqrt(cmplx), im: 0});	
		}
		
	}
	return false;
}

/**
Function: Complex.abs
	Returns the modulus of the Complex number.
*/
Complex.prototype.abs = function(){
	return Math.sqrt(this.imag()*this.imag()+this.real()*this.real());
}

/**
Function: Complex.mod
	Returns the modulus of the Complex number (Calls Complex.prototype.abs)
*/
Complex.prototype.mod = Complex.prototype.abs;

/**
Function: Complex.angle
	Returns the phase of the Complex number.
	Return range : [0, 2PI]
*/
Complex.prototype.angle = function(){
	return Math.atan2(this.imag(), this.real());
}


Complex.analiza = function(number){
	number = number.toString().replace(/pi/g, Math.PI);
	number = number.toString().replace(/e/g, Math.E);
	return parseFloat(number);	// Tratar como un float

}


//TODO: Complex Array Operations
(function(top){

	
	_Array = function(N){
		var __array = {};
		
		for(var i = 0; i<N; i++){
			__array[i] = new Complex(0);
		}
	}

	_Array.prototype.get=function(a,b){
		return this.__array[0];
	}
	window.Complex.Array=_Array;
}
)(window);
