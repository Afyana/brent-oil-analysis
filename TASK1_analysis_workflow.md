# Task 1: Analysis Workflow Documentation

## 1. Data Analysis Workflow

### 1.1 Data Loading and Initial Exploration
- Load Brent oil price dataset (CSV format)
- Convert Date column to datetime format
- Examine data quality: missing values, outliers, duplicates
- Generate summary statistics
- Create initial visualizations of price trends

### 1.2 Data Preprocessing
- Handle missing values (interpolation or removal)
- Create derived features:
  - Log returns: log(price_t) - log(price_{t-1})
  - Percentage changes
  - Rolling averages (7-day, 30-day, 90-day)
  - Volatility measures (rolling standard deviation)

### 1.3 Exploratory Data Analysis (EDA)
- Time series decomposition (trend, seasonality, residual)
- Stationarity testing (ADF test, KPSS test)
- Volatility pattern analysis
- Autocorrelation analysis (ACF/PACF plots)
- Event mapping: overlay major geopolitical events

### 1.4 Change Point Modeling
- Implement Bayesian change point detection using PyMC
- Model definition:
  - Discrete uniform prior for change point location (tau)
  - Normal priors for pre/post change means (μ₁, μ₂)
  - Normal likelihood with switch function
- MCMC sampling with convergence diagnostics

### 1.5 Interpretation and Insight Generation
- Posterior analysis of change points
- Event correlation mapping
- Quantitative impact measurement
- Confidence assessment

### 1.6 Dashboard Development
- Flask API backend
- React frontend with visualizations
- Interactive event exploration

## 2. Research Events Dataset

### 2.1 Compiled Events (1987-2022)

| Start Date | Event Name | Category | Description |
|------------|------------|----------|-------------|
| 1990-08-02 | Gulf War Invasion | Conflict | Iraq invades Kuwait |
| 1991-01-17 | Desert Storm | Conflict | US-led coalition attacks Iraq |
| 1997-01-01 | Asian Financial Crisis | Economic | Currency crisis in Asia |
| 2001-09-11 | 9/11 Attacks | Conflict | Terror attacks on US |
| 2002-01-01 | Venezuelan Strike | Political | PDVSA worker strike |
| 2003-03-20 | Iraq War | Conflict | US invasion of Iraq |
| 2005-01-01 | Hurricane Katrina | Natural Disaster | Major hurricane in US Gulf |
| 2008-01-01 | Global Financial Crisis | Economic | US housing market collapse |
| 2010-01-01 | Arab Spring | Political | Middle East uprisings |
| 2011-01-01 | Libyan Civil War | Conflict | Libyan revolution begins |
| 2014-01-01 | Oil Price Crash | Market | OPEC surplus, demand drop |
| 2015-01-01 | Iran Nuclear Deal | Political | Sanctions expected to lift |
| 2016-01-01 | OPEC Production Cut | Market | OPEC+ supply reduction |
| 2020-01-01 | COVID-19 Pandemic | Global Crisis | Global lockdowns, demand crash |
| 2020-04-20 | Negative Oil Prices | Market | WTI futures negative |
| 2021-01-01 | OPEC+ Supply Cuts | Market | Extended production cuts |
| 2022-02-24 | Russia-Ukraine War | Conflict | Russia invades Ukraine |

### 2.2 Event Data Structure

Create `data/events.csv`:

```csv
date,event_name,category,description,impact_level
1990-08-02,Gulf War Invasion,Conflict,Iraq invades Kuwait,High
1991-01-17,Desert Storm,Conflict,US-led coalition attacks Iraq,High
1997-01-01,Asian Financial Crisis,Economic,Currency crisis in Asia,Medium
2001-09-11,9/11 Attacks,Conflict,Terror attacks on US,High
2003-03-20,Iraq War,Conflict,US invasion of Iraq,High
2008-01-01,Global Financial Crisis,Economic,US housing market collapse,High
2010-01-01,Arab Spring,Political,Middle East uprisings,Medium
2011-01-01,Libyan Civil War,Conflict,Libyan revolution begins,High
2014-01-01,Oil Price Crash,Market,OPEC surplus and demand drop,High
2016-01-01,OPEC Production Cut,Market,OPEC+ supply reduction,High
2020-01-01,COVID-19 Pandemic,Global Crisis,Global lockdowns demand crash,High
2020-04-20,Negative Oil Prices,Market,WTI futures negative,High
2022-02-24,Russia-Ukraine War,Conflict,Russia invades Ukraine,High

3. Assumptions and Limitations
3.1 Statistical Assumptions
Independence: Observations are assumed to be independent conditional on the model parameters

Normality: Price changes follow a normal distribution (approximately)

Single Change Point: The basic model assumes one structural break at a time

Stationarity: Price series is assumed to be stationary after transformation

3.2 Modeling Limitations
Correlation ≠ Causation: Statistical associations do not prove causal relationships

Event Timing Uncertainty: Event dates are approximate

Confounding Factors: Multiple events may occur simultaneously

Lag Effects: Events may have delayed impact on prices

Data Limitations: Dataset ends in 2022, recent events excluded

3.3 Causality vs. Correlation Discussion
Change point detection identifies temporal correlation between events and price changes

Establishing causation requires:

Controlled experiments (not possible in macroeconomics)

Granger causality testing

Natural experiments or instrumental variables

Robust counterfactual analysis

4. Expected Outputs
Posterior Distribution: Probabilistic estimates of change point locations

Parameter Estimates: Pre/post-change mean prices and uncertainty intervals

Impact Quantification: Magnitude and confidence of price shifts

Event Association: Mapping of detected changes to historical events

Interactive Dashboard: Visualization tools for stakeholder exploration


### Step 5: Create Events CSV

Create `data/events.csv`:

```csv
date,event_name,category,description,impact_level
1990-08-02,Gulf War Invasion,Conflict,Iraq invades Kuwait,High
1991-01-17,Desert Storm,Conflict,US-led coalition attacks Iraq,High
1997-07-02,Asian Financial Crisis,Economic,Thai baht collapse triggers regional crisis,Medium
2001-09-11,9/11 Attacks,Conflict,Terror attacks on US,High
2002-12-02,Venezuelan Strike,Political,PDVSA worker strike disrupts oil exports,Medium
2003-03-20,Iraq War,Conflict,US invasion of Iraq,High
2005-08-29,Hurricane Katrina,Natural Disaster,Major hurricane in US Gulf,Medium
2008-09-15,Global Financial Crisis,Economic,Lehman Brothers collapse,High
2010-12-17,Arab Spring,Political,Tunisia protests begin,Medium
2011-02-15,Libyan Civil War,Conflict,Libyan revolution begins,High
2014-06-01,Iraq Insurgency,Conflict,ISIS advances in Iraq,Medium
2014-11-27,OPEC Meeting,Market,OPEC decides to maintain production levels,High
2015-07-14,Iran Nuclear Deal,Political,JCPOA agreement signed,Medium
2016-11-30,OPEC Production Cut,Market,OPEC+ agrees to production cuts,High
2020-01-03,Soleimani Killing,Conflict,US kills Iranian General Soleimani,Medium
2020-03-11,COVID-19 Pandemic,Global Crisis,WHO declares COVID-19 pandemic,High
2020-04-20,Negative Oil Prices,Market,WTI crude oil futures turn negative,High
2021-01-05,OPEC+ Supply Cuts,Market,Extended production cuts agreed,Medium
2022-02-24,Russia-Ukraine War,Conflict,Russia invades Ukraine,High

