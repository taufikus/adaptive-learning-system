
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
        this.fixations = []; // Store detected fixations
        this.lastProcessedSecond = -1;
        this.totalTimePassed = 0;
    
        // Fixation parameters
        this.spatialThreshold = 75; // Pixels (increased for more lenient detection)
        this.temporalThreshold = 50; // Milliseconds (shorter fixations now allowed)
        this.minPointsForFixation = 3; // Minimum number of points to constitute a fixation
    
        this.aoi = null; // Area of Interest
        this.currentFixation = null;
    
        this.paragraphFixations = []; // Store fixations relevant to paragraph areas
        this.lastProcessedTime = 0;
      }
    
      setAOI(coordinates) {
        this.aoi = coordinates;
      }
    
      addDataPoint(x, y, elapsedTime) {
        const point = {
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(y.toFixed(2)),
          elapsedTime: parseFloat(elapsedTime.toFixed(2)),
        };
    
        this.temporaryDataPoints.push(point);
        this.updateFixation(point);
    
        if (elapsedTime - this.lastProcessedTime >= 100) {
          this.finalDataPoints.push(this.calculateAveragePoint(this.temporaryDataPoints));
          this.detectFixations(this.temporaryDataPoints);
          this.temporaryDataPoints = [point]; // Keep only the last point
          this.lastProcessedTime = elapsedTime;
          this.totalTimePassed = Math.floor(elapsedTime / 1000);
        }
      }
    
      calculateAveragePoint(points) {
        const sum = points.reduce(
          (acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y,
            elapsedTime: point.elapsedTime,
          }),
          { x: 0, y: 0, elapsedTime: 0 }
        );
    
        return {
          x: parseFloat((sum.x / points.length).toFixed(2)),
          y: parseFloat((sum.y / points.length).toFixed(2)),
          elapsedTime: parseFloat((sum.elapsedTime / points.length).toFixed(2)),
        };
      }
    
      updateFixation(point) {
        if (!this.currentFixation) {
          this.currentFixation = { points: [point], startTime: point.elapsedTime };
        } else {
          const avgPoint = this.calculateAveragePoint(this.currentFixation.points);
          const distance = Math.sqrt(
            Math.pow(point.x - avgPoint.x, 2) + Math.pow(point.y - avgPoint.y, 2)
          );
    
          if (distance <= this.spatialThreshold) {
            this.currentFixation.points.push(point);
          } else {
            this.endCurrentFixation(point.elapsedTime);
            this.currentFixation = { points: [point], startTime: point.elapsedTime };
          }
        }
      }
    
      endCurrentFixation(endTime) {
        if (this.currentFixation && this.currentFixation.points.length >= this.minPointsForFixation) {
          const duration = endTime - this.currentFixation.startTime;
          if (duration >= this.temporalThreshold) {
            const avgFixationPoint = this.calculateAveragePoint(this.currentFixation.points);
            avgFixationPoint.duration = duration;
            this.fixations.push(avgFixationPoint);
            this.paragraphFixations.push(avgFixationPoint); // Store paragraph-level fixation
          }
        }
      }
    
      detectFixations(points) {
        if (this.currentFixation) {
          this.endCurrentFixation(points[points.length - 1].elapsedTime);
        }
      }
    
      getFixations() {
        if (this.currentFixation) {
          this.endCurrentFixation(this.temporaryDataPoints[this.temporaryDataPoints.length - 1].elapsedTime);
        }
        return this.fixations;
      }
    
      getTotalFixationDuration() {
        return this.fixations.reduce((total, fixation) => total + fixation.duration, 0);
      }
    
      getAverageFixationDuration() {
        if (this.fixations.length === 0) return 0;
        const totalDuration = this.getTotalFixationDuration();
        return parseFloat((totalDuration / this.fixations.length).toFixed(2));
      }
    
      isWithinAOI(fixation) {
        if (!this.aoi) return false;
        return (
          fixation.x >= this.aoi.x &&
          fixation.x <= this.aoi.x + this.aoi.width &&
          fixation.y >= this.aoi.y &&
          fixation.y <= this.aoi.y + this.aoi.height
        );
      }
    
      getFixationsInAOI() {
        return this.fixations.filter(fixation => this.isWithinAOI(fixation));
      }
    
      getFixationDensity() {
        if (!this.aoi) return 0;
        const fixationsInAOI = this.getFixationsInAOI();
        return fixationsInAOI.length / (this.aoi.width * this.aoi.height);
      }
    
      isReadingFlowGood() {
        if (this.paragraphFixations.length < 2) return false;
    
        let backwardYMovements = 0;
        for (let i = 1; i < this.paragraphFixations.length; i++) {
          const prev = this.paragraphFixations[i - 1];
          const current = this.paragraphFixations[i];
          if (current.y < prev.y - 10) {
            backwardYMovements++;
          }
        }
    
        return backwardYMovements / this.paragraphFixations.length <= 0.2;
      }
    
      getParagraphDensity(paragraphArea) {
        if (paragraphArea <= 0) return 0;
        const scalingFactor = 100000; 
        return (this.paragraphFixations.length / paragraphArea) * scalingFactor;
      }
    
      getEngagementScore() {
        if (!this.aoi) return 0;
    
        const totalDuration = this.getTotalFixationDuration();
        const avgDuration = this.getAverageFixationDuration();
        const fixationsInAOI = this.getFixationsInAOI().length;
        const totalFixations = this.fixations.length;
        const aoiProportion = totalFixations ? fixationsInAOI / totalFixations : 0;
        const readingFlowScore = this.isReadingFlowGood() ? 1 : 0;
    
        const weights = { 
          durationWeight: 0.25, 
          avgWeight: 0.25, 
          aoiWeight: 0.3, 
          flowWeight: 0.2 
        };
    
        const normalizedTotalDuration = totalDuration > 0 ? Math.min(totalDuration / (this.totalTimePassed * 1000), 1) : 0;
        const normalizedAvgDuration = avgDuration > 0 ? Math.min(avgDuration / 1500, 1) : 0;
        const normalizedAOICoverage = aoiProportion;
    
        return parseFloat((
          weights.durationWeight * normalizedTotalDuration +
          weights.avgWeight * normalizedAvgDuration +
          weights.aoiWeight * normalizedAOICoverage +
          weights.flowWeight * readingFlowScore
        ).toFixed(2));
      }
    
      clearFixations() {
        this.fixations = [];
        this.paragraphFixations = [];
      }
    }
    