'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from './Hero.module.css';

// Configuration types
interface BuildingType {
  type: string;
  complexity: number;
  lines: number;
  structures: string[];
}

interface Position {
  baseX: number;
  baseY: number;
  spreadX: number;
  spreadY: number;
  lengthX: number;
  lengthY: number;
}

interface TechSymbolType {
  symbols: string[];
  class: string;
  weight: number;
}

const Hero: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const connectionPointsRef = useRef<HTMLDivElement>(null);
  const techElementsRef = useRef<HTMLDivElement>(null);
  const particleSystemRef = useRef<HTMLDivElement>(null);
  const mouseTrailRef = useRef<HTMLDivElement>(null);
  
  const animationIdRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const particleIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Configuration
  const config = {
    buildingTypes: [
      { 
        type: 'residential', 
        complexity: 4, 
        lines: 12,
        structures: ['foundation', 'walls', 'roof', 'windows']
      },
      { 
        type: 'commercial', 
        complexity: 6, 
        lines: 18,
        structures: ['structure', 'floors', 'facade', 'mechanical']
      },
      { 
        type: 'industrial', 
        complexity: 5, 
        lines: 15,
        structures: ['framework', 'utilities', 'equipment', 'access']
      },
      { 
        type: 'mixed', 
        complexity: 7, 
        lines: 22,
        structures: ['foundation', 'structure', 'facade', 'services', 'landscape']
      }
    ],
    techSymbols: [
      '∠ 90°', '⌂ 24.5m', '≡ 3.2m', '⟂ 18.7m', '⊥ 45°', 
      '⌀ 12.4m', '□ 156m²', '△ 8.9m', '⟡ 120°', '※ 2.8m',
      '◇ 78m²', '⟨ 60°', '⟩ 135°', '⊙ 15.2m', '◈ 234m²',
      'R 5.5m', 'H 3.0m', 'W 12.8m', 'D 0.3m', 'L 25.6m'
    ],
    dimensionSymbols: [
      '24.50', '18.75', '12.20', '6.80', '3.65', '45.30',
      '156.8m²', '78.4m²', '234.5m²', '89.2m²'
    ],
    structuralSymbols: [
      'B1', 'C1', 'F1', 'W1', 'R1', 'S1', 'M1', 'E1'
    ],
    lineVariations: [
      'draw-animation', 'draw-animation-reverse', 'draw-complex', 'draw-burst', 'draw-structural'
    ]
  };

  // Utility Functions
  const getWeightedRandomChoice = useCallback(<T,>(choices: T[], weights: number[]): T => {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const randomNum = Math.random() * totalWeight;
    
    let weightSum = 0;
    for (let i = 0; i < choices.length; i++) {
      weightSum += weights[i];
      if (randomNum <= weightSum) {
        return choices[i];
      }
    }
    return choices[choices.length - 1];
  }, []);

  const getPhasePositions = useCallback((phase: string): Position => {
    const positions: Record<string, Position> = {
      foundation: {
        baseX: 960, baseY: 800,
        spreadX: 1200, spreadY: 100,
        lengthX: 800, lengthY: 50
      },
      structure: {
        baseX: 960, baseY: 540,
        spreadX: 1000, spreadY: 400,
        lengthX: 600, lengthY: 300
      },
      details: {
        baseX: 960, baseY: 540,
        spreadX: 1400, spreadY: 600,
        lengthX: 400, lengthY: 200
      },
      dimensions: {
        baseX: 960, baseY: 540,
        spreadX: 1600, spreadY: 700,
        lengthX: 200, lengthY: 100
      }
    };
    return positions[phase] || positions.structure;
  }, []);

  const createArchitecturalPath = useCallback((startX: number, startY: number, endX: number, endY: number): string => {
    const midX = startX + (endX - startX) * 0.5;
    const midY = startY + (endY - startY) * 0.5;
    
    if (Math.random() > 0.6) {
      // L-shaped path
      return `M${startX},${startY} L${midX},${startY} L${endX},${endY}`;
    } else if (Math.random() > 0.7) {
      // T-junction path
      return `M${startX},${startY} L${endX},${endY} M${midX},${midY} L${midX + (Math.random() - 0.5) * 200},${midY + (Math.random() - 0.5) * 200}`;
    } else {
      // Simple straight line
      return `M${startX},${startY} L${endX},${endY}`;
    }
  }, []);

  // Animation Functions
  const createBlueprintLine = useCallback((complexity: number, phase: string, lineTypes: string[]) => {
    if (!svgRef.current) return;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const positions = getPhasePositions(phase);
    
    const startX = positions.baseX + (Math.random() - 0.5) * positions.spreadX;
    const startY = positions.baseY + (Math.random() - 0.5) * positions.spreadY;
    const endX = startX + (Math.random() - 0.5) * positions.lengthX;
    const endY = startY + (Math.random() - 0.5) * positions.lengthY;
    
    const lineType = lineTypes[Math.floor(Math.random() * lineTypes.length)];
    const animationType = config.lineVariations[Math.floor(Math.random() * config.lineVariations.length)];
    
    let pathData: string;
    if (phase === 'foundation' || phase === 'structure') {
      pathData = Math.random() > 0.7 ? 
        createArchitecturalPath(startX, startY, endX, endY) : 
        `M${startX},${startY} L${endX},${endY}`;
    } else {
      if (Math.random() > 0.5) {
        const controlX = startX + (endX - startX) * 0.5 + (Math.random() - 0.5) * 100;
        const controlY = startY + (endY - startY) * 0.5 + (Math.random() - 0.5) * 100;
        pathData = `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`;
      } else {
        pathData = `M${startX},${startY} L${endX},${endY}`;
      }
    }
    
    path.setAttribute('class', `${styles.cadLine} ${styles[lineType.replace('-', '')]} ${styles[animationType.replace('-', '')]}`);
    path.setAttribute('d', pathData);
    path.style.setProperty('--duration', (Math.random() * 3 + 4) + 's');
    path.style.setProperty('--delay', (Math.random() * 1.5) + 's');
    
    svgRef.current.appendChild(path);
    
    // Cleanup
    setTimeout(() => {
      if (path.parentNode) {
        path.style.opacity = '0';
        setTimeout(() => {
          if (path.parentNode) {
            path.parentNode.removeChild(path);
          }
        }, 1000);
      }
    }, 15000 + Math.random() * 10000);
  }, [getPhasePositions, createArchitecturalPath, config.lineVariations]);

  const createBuildingPhase = useCallback((building: BuildingType, phase: string) => {
    const phaseConfig: Record<string, { lines: number; types: string[] }> = {
      foundation: { lines: Math.floor(building.lines * 0.3), types: ['structural-line', 'primary-line'] },
      structure: { lines: Math.floor(building.lines * 0.4), types: ['primary-line', 'secondary-line'] },
      details: { lines: Math.floor(building.lines * 0.2), types: ['secondary-line', 'construction-line', 'accent-line'] },
      dimensions: { lines: Math.floor(building.lines * 0.1), types: ['dimension-line'] }
    };

    const currentPhase = phaseConfig[phase];
    
    for (let i = 0; i < currentPhase.lines; i++) {
      setTimeout(() => {
        createBlueprintLine(building.complexity, phase, currentPhase.types);
      }, i * (Math.random() * 400 + 200));
    }
  }, [createBlueprintLine]);

  const generateRandomBuilding = useCallback(() => {
    const building = config.buildingTypes[Math.floor(Math.random() * config.buildingTypes.length)];
    
    // Clear existing paths gradually
    if (svgRef.current) {
      const existingPaths = svgRef.current.querySelectorAll('path');
      existingPaths.forEach((path, index) => {
        setTimeout(() => {
          if (path.parentNode) {
            path.style.opacity = '0';
            setTimeout(() => {
              if (path.parentNode) {
                path.parentNode.removeChild(path);
              }
            }, 500);
          }
        }, index * 100);
      });
    }
    
    // Generate building structure in phases
    setTimeout(() => {
      createBuildingPhase(building, 'foundation');
      setTimeout(() => createBuildingPhase(building, 'structure'), 2000);
      setTimeout(() => createBuildingPhase(building, 'details'), 4000);
      setTimeout(() => createBuildingPhase(building, 'dimensions'), 6000);
    }, 1000);
  }, [config.buildingTypes, createBuildingPhase]);

  const createConnectionPoints = useCallback(() => {
    if (!connectionPointsRef.current) return;
    
    connectionPointsRef.current.innerHTML = '';
    const pointCount = Math.floor(Math.random() * 6) + 8;
    
    for (let i = 0; i < pointCount; i++) {
      const point = document.createElement('div');
      const types = ['primary', 'dimension', 'accent', 'structural'];
      const weights = [0.4, 0.3, 0.2, 0.1];
      const pointType = getWeightedRandomChoice(types, weights);
      
      point.className = `${styles.connectionPoint} ${styles[pointType]}`;
      point.style.left = Math.random() * 95 + '%';
      point.style.top = Math.random() * 90 + '%';
      point.style.setProperty('--pulse-duration', (Math.random() * 2 + 3) + 's');
      point.style.setProperty('--pulse-delay', Math.random() * 4 + 's');
      
      connectionPointsRef.current.appendChild(point);
      
      // Auto cleanup
      setTimeout(() => {
        if (point.parentNode) {
          point.style.opacity = '0';
          setTimeout(() => {
            if (point.parentNode) {
              point.parentNode.removeChild(point);
            }
          }, 500);
        }
      }, Math.random() * 20000 + 15000);
    }
  }, [getWeightedRandomChoice]);

  const createTechSymbols = useCallback(() => {
    if (!techElementsRef.current) return;
    
    const symbolTypes: TechSymbolType[] = [
      { symbols: config.techSymbols, class: '', weight: 0.4 },
      { symbols: config.dimensionSymbols, class: 'dimension', weight: 0.4 },
      { symbols: config.structuralSymbols, class: 'structural', weight: 0.2 }
    ];
    
    const symbolCount = Math.floor(Math.random() * 5) + 4;
    
    for (let i = 0; i < symbolCount; i++) {
      setTimeout(() => {
        const symbolType = getWeightedRandomChoice(symbolTypes, symbolTypes.map(s => s.weight));
        const symbol = document.createElement('div');
        const symbolText = symbolType.symbols[Math.floor(Math.random() * symbolType.symbols.length)];
        
        symbol.className = `${styles.techSymbol} ${symbolType.class ? styles[symbolType.class] : ''}`;
        symbol.textContent = symbolText;
        symbol.style.left = Math.random() * 85 + '%';
        symbol.style.top = Math.random() * 75 + '%';
        symbol.style.setProperty('--tech-duration', (Math.random() * 4 + 8) + 's');
        symbol.style.setProperty('--tech-delay', Math.random() * 3 + 's');
        
        if (techElementsRef.current) {
          techElementsRef.current.appendChild(symbol);
        }
        
        // Auto cleanup
        setTimeout(() => {
          if (symbol.parentNode) {
            symbol.style.opacity = '0';
            setTimeout(() => {
              if (symbol.parentNode) {
                symbol.parentNode.removeChild(symbol);
              }
            }, 500);
          }
        }, Math.random() * 15000 + 10000);
      }, i * (Math.random() * 3000 + 1500));
    }
  }, [config.techSymbols, config.dimensionSymbols, config.structuralSymbols, getWeightedRandomChoice]);

  const createParticleSystem = useCallback(() => {
    if (!particleSystemRef.current) return;
    
    const addParticle = () => {
      if (!particleSystemRef.current) return;
      
      const particle = document.createElement('div');
      const particleType = Math.random() > 0.7 ? `${styles.particle} ${styles.dimension}` : styles.particle;
      
      particle.className = particleType;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.setProperty('--particle-duration', (Math.random() * 8 + 10) + 's');
      particle.style.setProperty('--particle-delay', '0s');
      
      particleSystemRef.current.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 18000);
    };
    
    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(addParticle, i * 500);
    }
    
    // Continuous particles
    particleIntervalRef.current = setInterval(addParticle, Math.random() * 3000 + 2000);
  }, []);

  const createBlueprintCrosshair = useCallback((x: number, y: number) => {
    if (!mouseTrailRef.current) return;
    
    const crosshair = document.createElement('div');
    crosshair.className = styles.crosshair;
    crosshair.style.left = x + 'px';
    crosshair.style.top = y + 'px';
    
    const hLine = document.createElement('div');
    hLine.className = styles.crosshairHorizontal;
    
    const vLine = document.createElement('div');
    vLine.className = styles.crosshairVertical;
    
    crosshair.appendChild(hLine);
    crosshair.appendChild(vLine);
    mouseTrailRef.current.appendChild(crosshair);
    
    setTimeout(() => {
      crosshair.style.opacity = '0';
      setTimeout(() => {
        if (crosshair.parentNode) {
          crosshair.parentNode.removeChild(crosshair);
        }
      }, 2000);
    }, 200);
  }, []);

  // Mouse interaction
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Create crosshairs occasionally
    if (Math.random() > 0.985) {
      createBlueprintCrosshair(e.clientX, e.clientY);
    }
    
    // Apply parallax effect
    const elements = document.querySelectorAll(`.${styles.connectionPoint}, .${styles.techSymbol}`);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    elements.forEach((el: Element, index: number) => {
      const intensity = (index % 4 + 1) * 0.2;
      const x = (e.clientX - centerX) * intensity * 0.008;
      const y = (e.clientY - centerY) * intensity * 0.008;
      
      const htmlEl = el as HTMLElement;
      const currentTransform = htmlEl.style.transform || '';
      const baseTransform = currentTransform.replace(/translate\([^)]*\)/g, '');
      htmlEl.style.transform = `translate(${x}px, ${y}px) ${baseTransform}`;
    });
  }, [createBlueprintCrosshair]);

  // Animation cycle
  const startAnimationCycle = useCallback(() => {
    const cycle = () => {
      const nextCycle = Math.random() * 10000 + 15000;
      
      animationIdRef.current = setTimeout(() => {
        generateRandomBuilding();
        
        // Regenerate elements periodically
        if (Math.random() > 0.6) {
          setTimeout(createConnectionPoints, 2000);
        }
        
        if (Math.random() > 0.4) {
          setTimeout(createTechSymbols, 4000);
        }
        
        cycle();
      }, nextCycle);
    };
    
    cycle();
  }, [generateRandomBuilding, createConnectionPoints, createTechSymbols]);

  // Effects
  useEffect(() => {
    // Initialize scene
    generateRandomBuilding();
    createConnectionPoints();
    createTechSymbols();
    createParticleSystem();
    startAnimationCycle();
    
    // Add mouse listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        clearTimeout(animationIdRef.current);
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, [generateRandomBuilding, createConnectionPoints, createTechSymbols, createParticleSystem, startAnimationCycle, handleMouseMove]);

  return (
    <section className={styles.heroSection}>
      {/* Blueprint Background */}
      <div className={styles.blueprintBackground}></div>
      <div className={styles.blueprintGrid}></div>

      {/* CAD Lines Canvas */}
      <div className={styles.cadCanvas}>
        <svg 
          ref={svgRef}
          className={styles.svgContainer} 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Lines will be added dynamically */}
        </svg>
      </div>

      {/* Connection Points */}
      <div ref={connectionPointsRef} className={styles.connectionPoints}></div>

      {/* Technical Elements */}
      <div ref={techElementsRef} className={styles.technicalElements}></div>

      {/* Particle System */}
      <div ref={particleSystemRef} className={styles.particleSystem}></div>

      {/* Title Block */}
      <div className={styles.titleBlock}>
        <div className={styles.titleBlockHeader}>PROJECT: CONSTRUCTION</div>
        <div>SCALE: 1:100</div>
        <div>DATE: 2025</div>
        <div className={styles.titleBlockFooter}>DRG NO: QS-001</div>
      </div>

      {/* Mouse Trail */}
      <div ref={mouseTrailRef} className={styles.mouseTrail}></div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.logoWhite}>my</span>
          <span className={styles.logoYellow}>QS</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Delivering comprehensive quantity surveying solutions<br />
          across all sectors of the built environment with precision, integrity, and innovation.
        </p>
        <a href="#services" className={styles.heroCta}>
          Get Quote
        </a>
        <a href="#services" className={styles.heroCta}>
          Sign up
        </a>
      </div>
    </section>
  );
};

export default Hero;