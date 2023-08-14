import { useState, useEffect } from "react";
import "./App.css";
import { Button , Badge , Card, Dropdown} from 'flowbite-react';

const leagues = [
  {
    key: "soccer_epl",
    name: "English Premier League",
  },
  {
    key: "soccer_spain_la_liga",
    name: "Spanish La Liga",
  },
  {
    key: "soccer_italy_serie_a",
    name: "Italian Serie A",
  },
  {
    key: "soccer_germany_bundesliga",
    name: "German Bundesliga",
  },
  {
    key: "soccer_france_ligue_one",
    name: "French Ligue 1",
  },
  {
    key: "soccer_uefa_champs_league",
    name: "UEFA Champions League",
  },
  {
    key: "soccer_uefa_europa_league",
    name: "UEFA Europa League",
  },
  {
    key: "soccer_sweden_allsvenskan",
    name: "Swedish Allsvenskan",
  },
];

function App() {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0].key);
  const [oddsData, setOddsData] = useState([]);

  useEffect(() => {
    const fetchOddsData = async () => {
      const apiKey = "3110bfdd2f5e4add37bbd609ffe48ded";
      const league = selectedLeague;
      const url = `https://api.the-odds-api.com/v4/sports/${league}/odds`;

      try {
        const response = await fetch(`${url}?apiKey=${apiKey}&regions=uk`);
        const data = await response.json();
        console.log(data);
        const filteredOdds = data.filter((odds) => {
          return (
            odds.sport_key === league &&
            odds.bookmakers &&
            odds.bookmakers.some(
              (bookmaker) =>
                bookmaker.key === "leovegas" &&
                bookmaker.markets &&
                bookmaker.markets.length > 0 &&
                bookmaker.markets[0].outcomes.some(
                  (outcome) => outcome.price <= 1.5
                )
            )
          );
        });
        console.log("filtered data", filteredOdds);
        setOddsData(filteredOdds);
      } catch (error) {
        console.error("Error fetching odds data:", error);
      }
    };

    fetchOddsData();
  }, [selectedLeague]);

  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
  };

  const renderSoccerOdds = () => {
    if (!oddsData || oddsData.length === 0) {
      console.log("No odds data available");
      return <p className="text-center pt-4 text-red-500">No odds data available</p>;
    }

    return (
      <div>


        <ul className="odds-list">
          {oddsData.map((odds) => {
            const leovegas = odds.bookmakers.find(
              (bookmaker) => bookmaker.key === "leovegas"
            );

            if (!leovegas) {
              return null;
            }

            const h2hMarket = leovegas.markets.find(
              (market) => market.key === "h2h"
            );

            if (!h2hMarket) {
              return null;
            }

            const filteredOutcomes = h2hMarket.outcomes.filter(
              (outcome) => outcome.price <= 1.5
            );

            if (filteredOutcomes.length === 0) {
              return null;
            }

            const lowestOutcome = filteredOutcomes.reduce((prev, current) =>
              prev.price < current.price ? prev : current
            );

            const lowestOutcomeTeam = h2hMarket.outcomes.find(
              (outcome) => outcome.name === lowestOutcome.name.split(" v ")[0]
            );

            if (!lowestOutcomeTeam) {
              return null;
            }

            return (

              <div className="pt--10 pr-0 pb-2 pl-0">

          <div className="pt-5 pr-0 pb-0 pl-0 mt-5 mr-0 mb-0 ml-0">
            <div className="sm:flex sm:items-center sm:justify-between sm:space-x-5">
              <div className="flex items-center flex-1 min-w-0">
                <img src="https://cdn.midjourney.com/fa296751-2c5e-4cc4-bbc0-9d44b33fb290/0_0.png" class="flex-shrink-0
                    object-cover rounded-full btn- w-10 h-10"/>
                <div className="mt-0 mr-0 mb-0 ml-4 flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-800 truncate">{odds.home_team} vs. {odds.away_team}</p>
                  <p className="text-gray-600 text-md">{new Date(odds.commence_time).toLocaleString()}</p>
                  
                </div>
              </div>
              <div className="mt-4 mr-0 mb-0 ml-0 pt-0 pr-0 pb-0 pl-14 flex items-center sm:space-x-6 sm:pl-0 sm:justify-end
                  sm:mt-0">
                 <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-blue-700/10">
      {lowestOutcomeTeam.name} : {lowestOutcome.price}</span>
              </div>
            </div>
          </div>


              </div>
             
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="App">
      
      <div className="flex flex-col items-center mx-auto max-w-screen-lg">

      <h2 className="text-center pb-12 text-5xl font-bold">Possible Wins</h2>

      <p className="text-center pb-4">The 'Possible Wins' app presents real-time soccer odds data from diverse leagues, highlighting matches with high winning potential. Users select their preferred league and access match details, team insights, match times, and advantageous odds. It's the go-to platform for discovering profitable betting opportunities.</p>
      <p className="text-center pb-4 text-red-500 text-xs">Keep in mind that this analysis will be speculative and should not be used for betting decisions.</p>
        <select
          className="mb-4"
          value={selectedLeague}
          onChange={handleLeagueChange}
        >
          {leagues.map((league) => (
            <option key={league.key} value={league.key}>
              {league.name}
            </option>
          ))}
        </select>
        <div className="odds">{renderSoccerOdds()}</div>
      </div>
    </div>
  );
}

export default App;