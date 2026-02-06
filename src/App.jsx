import { useState } from 'react'
import './App.css'

function App() {
  const [urduInput, setUrduInput] = useState('');
  const [analysis, setAnalysis] = useState([]);

  const letterSystems = {
    abi: {
      letters: ['ج', 'ز', 'ک', 'س', 'ق', 'ث', 'ظ'],
      rows: [
        { name: "kamri kimat", values: [3, 7, 20, 60, 100, 500, 900] },
        { name: "kamri adad", values: [1, 1, 1, 1, 1, 1, 1] },
        { name: "malfuzi kimat", values: [53, 8, 101, 120, 181, 501, 901] },
        { name: "malfuzi mufrid", values: [8, 8, 2, 3, 1, 6, 1] },
        { name: "arbic kimat", values: [1036, 137, 630, 520, 47, 752, 582] },
        { name: "arbic mufrid", values: [5, 4, 5, 4, 4, 8, 8] }
      ]
    },
    khaki: {
      letters: ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'],
      rows: [
        { name: "kamri kimat", values: [4, 8, 30, 70, 200, 600, 1000] },
        { name: "kamri adad", values: [1, 1, 1, 1, 1, 1, 1] },
        { name: "malfuzi kimat", values: [35, 9, 71, 130, 201, 601, 1060] },
        { name: "malfuzi mufrid", values: [8, 9, 8, 4, 3, 7, 7] },
        { name: "arbic kimat", values: [278, 606, 109, 192, 501, 512, 111] },
        { name: "arbic mufrid", values: [5, 6, 6, 5, 5, 7, 3] }
      ]
    },
    badi: {
      letters: ['ب', 'و/ؤ', 'ی/ئ', 'ن', 'ص', 'ت', 'ض'],
      rows: [
        { name: "kamri kimat", values: [2, 6, 10, 50, 90, 400, 800] },
        { name: "kamri adad", values: [1, 1, 1, 1, 1, 1, 1] },
        { name: "malfuzi kimat", values: [3, 13, 11, 106, 95, 401, 805] },
        { name: "malfuzi mufrid", values: [3, 4, 2, 7, 5, 5, 4] },
        { name: "arbic kimat", values: [611, 465, 575, 760, 590, 325, 653] },
        { name: "arbic mufrid", values: [5, 3, 4, 5, 5, 9, 10] }
      ]
    },
    atashi: {
      letters: ['ا/ء/ؤ/ئ', 'ہ', 'ط', 'م', 'ف', 'ش', 'ذ'],
      rows: [
        { name: "kamri kimat", values: [1, 5, 9, 40, 80, 300, 700] },
        { name: "kamri adad", values: [1, 1, 1, 1, 1, 1, 1] },
        { name: "malfuzi kimat", values: [111, 6, 10, 90, 81, 360, 731] },
        { name: "malfuzi mufrid", values: [3, 6, 1, 9, 9, 9, 2] },
        { name: "arbic kimat", values: [19, 705, 535, 333, 651, 1083, 184] },
        { name: "arbic mufrid", values: [4, 4, 4, 6, 6, 9, 8] }
      ]
    }
  };

  const classifyLetter = (letter) => {
    const categories = [];
    if (letterSystems.abi.letters.includes(letter)) categories.push('abi');
    if (letterSystems.khaki.letters.includes(letter)) categories.push('khaki');
    if (letterSystems.badi.letters.some(l => l.includes(letter))) categories.push('badi');
    if (letterSystems.atashi.letters.some(l => l.includes(letter))) categories.push('atashi');
    return categories;
  };

  const getRowValue = (letter, system, rowIndex) => {
    const letters = letterSystems[system].letters;
    const index = letters.findIndex(l => l.includes(letter));
    if (index !== -1) {
      return letterSystems[system].rows[rowIndex].values[index];
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setUrduInput(text);
    const result = text.split('').map(letter => {
      const categories = classifyLetter(letter);
      const rowValues = {};
      categories.forEach(cat => {
        rowValues[cat] = {
          kamriKimat: getRowValue(letter, cat, 0),
          kamriAdad: getRowValue(letter, cat, 1),
          malfuziKimat: getRowValue(letter, cat, 2),
          malfuziMufrid: getRowValue(letter, cat, 3),
          arbicKimat: getRowValue(letter, cat, 4),
          arbicMufrid: getRowValue(letter, cat, 5)
        };
      });
      return { letter, categories, rowValues };
    });
    setAnalysis(result);
  };

  const calculateRowTotal = (rowName) => {
    return analysis.reduce((sum, item) => {
      const letterSum = Object.values(item.rowValues).reduce((a, b) => a + b[rowName], 0);
      return sum + letterSum;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateRowTotal('kamriKimat') * 
           calculateRowTotal('kamriAdad') * 
           calculateRowTotal('malfuziKimat') * 
           calculateRowTotal('malfuziMufrid') * 
           calculateRowTotal('arbicKimat') * 
           calculateRowTotal('arbicMufrid');
  };

  const findSystemForValue = (value) => {
    for (let system in letterSystems) {
      const found = letterSystems[system].rows[0].values.includes(value);
      if (found) return system;
    }
    return null;
  };

  const findLetterForValue = (value) => {
    for (let system in letterSystems) {
      const index = letterSystems[system].rows[0].values.indexOf(value);
      if (index !== -1) {
        return { letter: letterSystems[system].letters[index], system };
      }
    }
    return null;
  };

  const analyzeUltimateResult = (num) => {
    const str = num.toString();
    const parts = [];
    
    for (let i = str.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      parts.unshift(str.slice(start, i));
    }
    
    const analysis = [];
    parts.forEach(part => {
      const num = parseInt(part);
      const breakdown = [];
      
      if (num >= 100) {
        const hundreds = Math.floor(num / 100) * 100;
        const tens = Math.floor((num % 100) / 10) * 10;
        const ones = num % 10;
        if (hundreds > 0) {
          const info = findLetterForValue(hundreds);
          if (info) breakdown.push({ value: hundreds, ...info });
        }
        if (tens > 0) {
          const info = findLetterForValue(tens);
          if (info) breakdown.push({ value: tens, ...info });
        }
        if (ones > 0) {
          const info = findLetterForValue(ones);
          if (info) breakdown.push({ value: ones, ...info });
        }
      } else if (num >= 10) {
        const tens = Math.floor(num / 10) * 10;
        const ones = num % 10;
        if (tens > 0) {
          const info = findLetterForValue(tens);
          if (info) breakdown.push({ value: tens, ...info });
        }
        if (ones > 0) {
          const info = findLetterForValue(ones);
          if (info) breakdown.push({ value: ones, ...info });
        }
      } else if (num > 0) {
        const info = findLetterForValue(num);
        if (info) breakdown.push({ value: num, ...info });
      }
      
      if (breakdown.length > 0) {
        analysis.push({ original: num, breakdown });
      }
    });
    
    return analysis;
  };

  const categorizeBreakdown = () => {
    const total = calculateGrandTotal();
    const str = total.toString();
    const parts = [];
    
    for (let i = str.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      parts.unshift(str.slice(start, i));
    }
    
    const breakdown = [];
    parts.forEach(part => {
      const num = parseInt(part);
      if (num >= 100) {
        const hundreds = Math.floor(num / 100) * 100;
        const tens = Math.floor((num % 100) / 10) * 10;
        const ones = num % 10;
        if (hundreds > 0) breakdown.push(hundreds);
        if (tens > 0) breakdown.push(tens);
        if (ones > 0) breakdown.push(ones);
      } else if (num >= 10) {
        const tens = Math.floor(num / 10) * 10;
        const ones = num % 10;
        if (tens > 0) breakdown.push(tens);
        if (ones > 0) breakdown.push(ones);
      } else if (num > 0) {
        breakdown.push(num);
      }
    });
    
    const rightTable = { atashi: [], badi: [] };
    const leftTable = { khaki: [], abi: [] };
    
    breakdown.forEach(value => {
      const system = findSystemForValue(value);
      if (system === 'atashi') rightTable.atashi.push(value);
      else if (system === 'badi') rightTable.badi.push(value);
      else if (system === 'khaki') leftTable.khaki.push(value);
      else if (system === 'abi') leftTable.abi.push(value);
    });
    
    return { rightTable, leftTable, breakdown };
  };

  return (
    <div className="app">
      <div className="header">
        <h2>🌙ابوبکر روحانی ویلفیرٹرسٹ</h2>
      </div>
      
      <div className="container">
        <div className="input-section">
          <input
            type="text"
            value={urduInput}
            onChange={handleInputChange}
            placeholder="یہاں اردو متن درج کریں..."
            className="urdu-input"
          />
        </div>

        {analysis.length > 0 && (
          <>
            <div className="card">
              <h3>Letter Analysis</h3>
              <div className="letters-grid">
                {analysis.map((item, idx) => (
                  <div key={idx} className="letter-card">
                    <div className="letter-display">{item.letter}</div>
                    <div className="letter-system">
                      {item.categories.length > 0 ? item.categories.join(', ') : 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Calculation Results</h3>
              <div className="totals-grid">
                <div className="total-item">
                  <span className="total-label">Kamri Kimat</span>
                  <span className="total-value">{calculateRowTotal('kamriKimat')}</span>
                </div>
                <div className="total-item">
                  <span className="total-label">Kamri Adad</span>
                  <span className="total-value">{calculateRowTotal('kamriAdad')}</span>
                </div>
                <div className="total-item">
                  <span className="total-label">Malfuzi Kimat</span>
                  <span className="total-value">{calculateRowTotal('malfuziKimat')}</span>
                </div>
                <div className="total-item">
                  <span className="total-label">Malfuzi Mufrid</span>
                  <span className="total-value">{calculateRowTotal('malfuziMufrid')}</span>
                </div>
                <div className="total-item">
                  <span className="total-label">Arbic Kimat</span>
                  <span className="total-value">{calculateRowTotal('arbicKimat')}</span>
                </div>
                <div className="total-item">
                  <span className="total-label">Arbic Mufrid</span>
                  <span className="total-value">{calculateRowTotal('arbicMufrid')}</span>
                </div>
              </div>
            </div>

            <div className="highlight-box" style={{display: 'none'}}>
              <div className="label">Grand Total</div>
              <div className="value">{calculateGrandTotal().toLocaleString()}</div>
            </div>

            {calculateGrandTotal() > 0 && (() => {
              const { rightTable, leftTable, breakdown } = categorizeBreakdown();
              const rightSum = [...rightTable.atashi, ...rightTable.badi].reduce((a, b) => a + b, 0);
              const leftSum = [...leftTable.khaki, ...leftTable.abi].reduce((a, b) => a + b, 0);
              const finalResult = rightSum * leftSum;
              const kamriKimat = calculateRowTotal('kamriKimat');
              const ultimateResult = finalResult * 660 * kamriKimat;
              
              return (
                <>
                  <h3>Breakdown Analysis</h3>
                  
                  <div className="tables-container">
                    <div className="mini-table">
                      <h4>Atashi + Badi</h4>
                      <div className="mini-table-row">
                        <strong>Atashi:</strong> {rightTable.atashi.length > 0 ? rightTable.atashi.join(', ') : 'None'}
                      </div>
                      <div className="mini-table-row">
                        <strong>Badi:</strong> {rightTable.badi.length > 0 ? rightTable.badi.join(', ') : 'None'}
                      </div>
                      <div className="mini-table-sum">{rightSum}</div>
                    </div>
                    <div className="mini-table">
                      <h4>Khaki + Abi</h4>
                      <div className="mini-table-row">
                        <strong>Khaki:</strong> {leftTable.khaki.length > 0 ? leftTable.khaki.join(', ') : 'None'}
                      </div>
                      <div className="mini-table-row">
                        <strong>Abi:</strong> {leftTable.abi.length > 0 ? leftTable.abi.join(', ') : 'None'}
                      </div>
                      <div className="mini-table-sum">{leftSum}</div>
                    </div>
                  </div>

                  <div className="highlight-box" style={{display: 'none'}}>
                    <div className="label">Final Result</div>
                    <div className="value">{rightSum} × {leftSum} = {finalResult.toLocaleString()}</div>
                  </div>

                  <div className="highlight-box" style={{display: 'none'}}>
                    <div className="label">Ultimate Result</div>
                    <div className="value">{ultimateResult.toLocaleString()}</div>
                    <div className="label" style={{marginTop: '0.5rem', fontSize: '0.8rem'}}>
                      {finalResult.toLocaleString()} × 660 × {kamriKimat}
                    </div>
                  </div>

                  <div className="card">
                    <h3>Letter Breakdown</h3>
                    <div className="letters-grid">
                      {analyzeUltimateResult(ultimateResult).map((group, idx) => (
                        <div key={idx} className="letter-card" style={{padding: '0.75rem'}}>
                          <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.25rem'}}>
                            {group.original}
                          </div>
                          <div style={{fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem'}}>
                            {group.breakdown.map(b => b.value).join('+')}
                          </div>
                          {group.breakdown.map((item, i) => (
                            <div key={i} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', padding: '0.25rem', background: '#f8f9ff', borderRadius: '4px'}}>
                              <div style={{fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea', fontFamily: 'Noto Nastaliq Urdu, serif'}}>{item.letter}</div>
                              <div style={{fontSize: '0.75rem', color: '#666'}}>= {item.value}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}

export default App
