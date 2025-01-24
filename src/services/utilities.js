
export const getTextGroupedContent = (contents) => {

    const groupedContents = contents.reduce((acc, item) => {
      const existingGroup = acc.find(group => group.category === item.category);
      if (existingGroup) {
        existingGroup.list.push(item);
      } else {
        acc.push({ category: item.category, list: [item] });
      }
      return acc;
    }, []);
    
    return groupedContents;
    
    }
  
   export class GazeDataCollector {
    constructor() {
      this.temporaryDataPoints = [];
      this.finalDataPoints = [];
      this.lastProcessedSecond = -1;
      this.totalTimePassed = 0;
    }
  
    addDataPoint(x, y, elapsedTime) {
      // Convert elapsedTime to seconds
      const currentSecond = Math.floor(elapsedTime / 1000);
  
      // If it's a new second, process previous second's data
      if (currentSecond !== this.lastProcessedSecond && this.temporaryDataPoints.length > 0) {
        const avgPoint = this.calculateAveragePoint(this.temporaryDataPoints);
        this.finalDataPoints.push(avgPoint);
        
        // Reset temporary points
        this.temporaryDataPoints = [];
        this.lastProcessedSecond = currentSecond;
        this.totalTimePassed += 1;
      }
  
      // Always add current data point
      this.temporaryDataPoints.push({ 
        x: parseFloat(x.toFixed(2)), 
        y: parseFloat(y.toFixed(2)), 
        elapsedTime: parseFloat(elapsedTime.toFixed(2)) 
      });
    }
  
    calculateAveragePoint(points) {
      const sum = points.reduce((acc, point) => ({
        x: acc.x + point.x,
        y: acc.y + point.y,
        elapsedTime: point.elapsedTime
      }), { x: 0, y: 0, elapsedTime: 0 });
  
      return {
        x: parseFloat((sum.x / points.length).toFixed(2)),
        y: parseFloat((sum.y / points.length).toFixed(2)),
        elapsedTime: parseFloat((sum.elapsedTime / points.length).toFixed(2))
      };
    }
  
    getFinalDataPoints() {
      return {
        dataPoints: this.finalDataPoints,
        totalTimePassedInSeconds: this.totalTimePassed
      };
    }
  
    clearFinalDataPoints() {
      this.finalDataPoints = [];
    }
  
    // Debug method to print current state
    debugState() {
      console.log('Temporary Points:', this.temporaryDataPoints);
      console.log('Final Points:', this.finalDataPoints);
    }
  }