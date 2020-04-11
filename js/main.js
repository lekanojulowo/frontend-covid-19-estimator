"use strict";
const $q = document.querySelector.bind(document);
const $qa = document.querySelectorAll.bind(document);


// Estimator
const covid19ImpactEstimator = (data) => {
	// Destructuring the given data
	const {
		region: {
			avgDailyIncomeInUSD,
			avgDailyIncomePopulation
		},
		periodType,
		reportedCases,
		totalHospitalBeds,
	} = data;
	let {
		timeToElapse
	} = data;

	// Custom Functions and Variables

	// normalize days; check for weeks and months if used
	if (periodType === "months") timeToElapse = Math.trunc(timeToElapse * 30);
	else if (periodType === "weeks") timeToElapse = Math.trunc(timeToElapse * 7);
	else timeToElapse = Math.trunc(timeToElapse * 1);

	// calculate InfectionsByRequestedTime
	const calculateInfectionsByRequestedTime = (currentlyInfected) => {
		const factor = Math.trunc(timeToElapse / 3);
		return currentlyInfected * 2 ** factor;
	};
	// calculate AvailableBeds
	const calculateAvailableBeds = (severeCasesByRequestedTime) => {
		const bedsAvailable = totalHospitalBeds * 0.35;
		const shortage = bedsAvailable - severeCasesByRequestedTime;
		const result = shortage < 0 ? shortage : bedsAvailable;
		return Math.trunc(result);
	};

	// calculate dollarsInFlight
	const calculateDollarsInFlight = (infectionsByRequestedTime) => {
		const infections =
			infectionsByRequestedTime *
			avgDailyIncomeInUSD *
			avgDailyIncomePopulation;
		const result = infections / timeToElapse;
		return Math.trunc(result);
	};

	// the best case estimation
	const impact = {};
	// challenge 1
	impact.currentlyInfected = reportedCases * 10;
	impact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
		impact.currentlyInfected
	);
	// challenge 2
	impact.severeCasesByRequestedTime = Math.trunc(
		impact.infectionsByRequestedTime * 0.15
	);
	impact.hospitalBedsByRequestedTime = calculateAvailableBeds(
		impact.severeCasesByRequestedTime
	);
	// challenge 3
	impact.casesForICUByRequestedTime = Math.trunc(
		impact.infectionsByRequestedTime * 0.05
	);
	impact.casesForVentilatorsByRequestedTime = Math.trunc(
		impact.infectionsByRequestedTime * 0.02
	);
	impact.dollarsInFlight = calculateDollarsInFlight(
		impact.infectionsByRequestedTime
	);

	// the severe case estimation
	const severeImpact = {};
	// challenge 1
	severeImpact.currentlyInfected = reportedCases * 50;
	severeImpact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
		severeImpact.currentlyInfected
	);
	// challenge 2
	severeImpact.severeCasesByRequestedTime = Math.trunc(
		severeImpact.infectionsByRequestedTime * 0.15
	);
	severeImpact.hospitalBedsByRequestedTime = calculateAvailableBeds(
		severeImpact.severeCasesByRequestedTime
	);
	// challenge 3
	severeImpact.casesForICUByRequestedTime = Math.trunc(
		severeImpact.infectionsByRequestedTime * 0.05
	);
	severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
		severeImpact.infectionsByRequestedTime * 0.02
	);
	severeImpact.dollarsInFlight = calculateDollarsInFlight(
		severeImpact.infectionsByRequestedTime
	);

	return {
		data, // the input data you got
		impact, // your best case estimation
		severeImpact, // your severe case estimation
	};
};

// Proccess Frontend;
const goEstimate = $q("[data-go-estimate]");

const showAlert = (className, message) => {
	const div = document.createElement("div");
	div.className = `alert alert-${className}`;
	div.innerHTML = `${message}`;
	document.body.appendChild(div);
	setTimeout(() => div.remove(), 3000);
};

goEstimate.addEventListener("click", (event) => {
	event.preventDefault();

	// input data
	const pType = $q("[data-period-type]");
	const tmToElapse = $q("[data-time-to-elapse]");
	const rCases = $q("[data-reported-cases]");
	const populatn = $q("[data-population]");
	const tHospitalBeds = $q("[data-total-hospital-beds]");

	const periodType = pType.value;
	const timeToElapse = parseInt(tmToElapse.value);
	const reportedCases = parseInt(rCases.value);
	const population = parseInt(populatn.value);
	const totalHospitalBeds = parseInt(tHospitalBeds.value);

	if (
		!periodType ||
		!timeToElapse ||
		!reportedCases ||
		!population ||
		!totalHospitalBeds
	) {
		showAlert("error", "Oops! Please fill all fields.");
	} else {
		goEstimate.disabled = true;

		const input = {
			region: {
				name: "Africa",
				avgAge: 19.7,
				avgDailyIncomeInUSD: 5,
				avgDailyIncomePopulation: 0.71,
			},
			periodType,
			timeToElapse,
			reportedCases,
			population,
			totalHospitalBeds,
		};
		const covid19 = covid19ImpactEstimator(input);
		const impact = covid19.impact;
		const severeImpact = covid19.severeImpact;
		const impactUI = $q("#impact");
		const severeImpactUI = $q("#severeImpact");
		const impactsContainner = $q(".impacts");
		impactUI.innerHTML = `
      <tr>
        <th>Currently Infected</th>
        <td>${impact.currentlyInfected}</td>
      </tr>
      <tr>
        <th>Infections By Requested Time</th>
        <td>${impact.infectionsByRequestedTime}</td>
      </tr>
      <tr>
        <th>Severe Cases By Requested Time</th>
        <td>${impact.severeCasesByRequestedTime}</td>
      </tr>
      <tr>
        <th>Hospital Beds By Requested Time</th>
        <td>${impact.hospitalBedsByRequestedTime}</td>
      </tr>
      <tr>
        <th>Cases For ICU By Requested Time</th>
        <td>${impact.casesForICUByRequestedTime}</td>
      </tr>
      <tr>
        <th>Cases For Ventilators By Requested Time</th>
        <td>${impact.casesForVentilatorsByRequestedTime}</td>
      </tr>
      <tr>
        <th>Dollars In Flight</th>
        <td>${impact.dollarsInFlight}</td>
      </tr>
    `;

		severeImpactUI.innerHTML = `
      <tr>
        <th>Currently Infected</th>
        <td>${severeImpact.currentlyInfected}</td>
      </tr>
      <tr>
        <th>Infections By Requested Time</th>
        <td>${severeImpact.infectionsByRequestedTime}</td>
      </tr>
      <tr>
        <th>Severe Cases By Requested Time</th>
        <td>${severeImpact.severeCasesByRequestedTime}</td>
      </tr>
      <tr>
        <th>Hospital Beds By Requested Time</th>
        <td>${severeImpact.hospitalBedsByRequestedTime}</td>
      </tr>
      <tr>
        <th>Cases For ICU By Requested Time</th>
        <td>${severeImpact.casesForICUByRequestedTime}</td>
      </tr>
      <tr>
        <th>Cases For Ventilators By Requested Time</th>
        <td>${severeImpact.casesForVentilatorsByRequestedTime}</td>
      </tr>
      <tr>
        <th>Dollars In Flight</th>
        <td>${severeImpact.dollarsInFlight}</td>
      </tr>
    `;

		showAlert(
			"success",
			"Data Submitted, scroll down to view impact analysis."
		);
		impactsContainner.classList.remove("is-hidden");
		goEstimate.disabled = false;
		pType.value = "";
		tmToElapse.value = "";
		rCases.value = "";
		populatn.value = "";
		tHospitalBeds.value = "";

		// console.log(covid19.data);
		// console.log(covid19.impact);
		// console.log(covid19.severeImpact);
	}
});

/* const input = {
  region: {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: "days",
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
} */

// }
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function () {
//     navigator.serviceWorker.register('service-worker.js').then(function (registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function (err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }

document.addEventListener('DOMContentLoaded', () => $q('#population').focus());