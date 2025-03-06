import React from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonCardContent, IonLabel, IonMenuButton, IonPage, IonTitle, IonRange,
  IonToolbar, IonItem, IonCard, IonSearchbar, IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import logo from "../assets/logo.png"
import profile from "../assets/profile.jpg"
import { useEffect, useRef, useState } from "react";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const Home: React.FC = () => {
  const [investmentType, setInvestmentType] = useState<"sip" | "lumpsum">("sip");
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Calculate Estimated Returns Dynamically
  const r = returnRate / 12 / 100; // Monthly interest rate
  const n = timePeriod * 12; // Total months
  const investedAmount = monthlyInvestment * n;
  const estimatedReturns = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalValue = investedAmount + estimatedReturns;

  // For DonutChart
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous chart
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Invested Amount", "Est. Returns"],
          datasets: [
            {
              data: [investedAmount, estimatedReturns],
              backgroundColor: ["#d3d3d3", "#4169e1"],
              hoverBackgroundColor: ["#a9a9a9", "#1e90ff"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%", // Donut chart effect
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Cleanup on component unmount
      }
    };
  }, [investedAmount, estimatedReturns]);

  return (
    <>
      {/* Menu Content */}
      <IonMenu side="end" contentId="main-content">
        <IonCard className="banner-card">
          <div className="banner-content">
            <img src={profile} alt="Profile Icon" className="banner-image" />
            <div className="banner-text">
              <h6>Simple & Free Investing</h6>
              <IonButton color="success" size="small">Login/Register</IonButton>
            </div>
          </div>
        </IonCard>

        <IonContent className="ion-padding">
          <IonItem className="multi-line-item">
            <div>
              <div className='menu-pd'>Filter Stocks</div>
              <div className='menu-pd'>Filter Mutual Funds</div>
              <div className='menu-pd'>Filter US Stocks</div>
            </div>
          </IonItem>
          <IonItem>
            <div>
              <div className='menu-pd'>Smart Save</div>
              <div className='menu-pd'>Compare Funds</div>
            </div>
          </IonItem>
          <IonItem>
            <div className='menu-pd'>Credit</div>
          </IonItem>
          <IonItem>
            <div>
              <div className='menu-pd'>View in App</div>
              <div className='menu-pd'>Help and Support</div>
            </div>
          </IonItem>
        </IonContent>
      </IonMenu>

      {/* Main Page */}
      <IonPage id="main-content">
        {/* Navigation Bar */}
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <div className='menu-title'>
                <div>
                  <img src={logo} alt="Groww Logo" />
                </div>
                <div>
                  <IonTitle>Groww</IonTitle>
                </div>
                <div>
                  <IonSearchbar></IonSearchbar>
                </div>
              </div>
            </IonTitle>
            <IonButtons slot="end">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* Home Page */}
        <IonContent className="ion-padding">
          <h2>SIP Calculator</h2>

          {/* SIP / Lumpsum Toggle */}
          <IonSegment value={investmentType} onIonChange={(e) => setInvestmentType(e.detail.value as "sip" | "lumpsum")}>
            <IonSegmentButton value="sip">
              <IonLabel>SIP</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="lumpsum">
              <IonLabel>Lumpsum</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* Monthly Investment */}
          <IonGrid>
            <IonRow>
              <IonCol size="8"><strong>Monthly investment</strong></IonCol>
              <IonCol size="4" className="value">₹ {monthlyInvestment.toLocaleString()}</IonCol>
            </IonRow>
          </IonGrid>
          <IonRange min={500} max={100000} step={500} value={monthlyInvestment}
            onIonChange={(e) => setMonthlyInvestment(e.detail.value as number)} />

          {/* Expected Return Rate */}
          <IonGrid>
            <IonRow>
              <IonCol size="8"><strong>Expected return rate (p.a)</strong></IonCol>
              <IonCol size="4" className="value">{returnRate}%</IonCol>
            </IonRow>
          </IonGrid>
          <IonRange min={5} max={20} step={0.5} value={returnRate}
            onIonChange={(e) => setReturnRate(e.detail.value as number)} />

          {/* Time Period */}
          <IonGrid>
            <IonRow>
              <IonCol size="8"><strong>Time period</strong></IonCol>
              <IonCol size="4" className="value">{timePeriod} Yr</IonCol>
            </IonRow>
          </IonGrid>
          <IonRange min={1} max={30} step={1} value={timePeriod}
            onIonChange={(e) => setTimePeriod(e.detail.value as number)} />

          {/* Invested Amount Display */}
          <IonCard>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6"><strong>Invested amount</strong></IonCol>
                  <IonCol size="6" className="value">₹{(monthlyInvestment * 12 * timePeriod).toLocaleString()}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6"><strong>Est. returns</strong></IonCol>
                  <IonCol size="6" className="amount">₹{estimatedReturns.toLocaleString()}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6"><strong>Total value</strong></IonCol>
                  <IonCol size="6" className="amount">₹{totalValue.toLocaleString()}</IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Chart Display */}
          <IonCard>
            <IonCardContent>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <canvas ref={chartRef} style={{ width: "90%", height: "250px" }}></canvas>
              </div>
             </IonCardContent>
          </IonCard>

        </IonContent>
      </IonPage>
    </>
  );
}
export default Home;
