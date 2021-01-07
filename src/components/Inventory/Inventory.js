import React from 'react';

const Inventory = () => {
    const savedCart={B071SF41Y9: 15, B01CG62D00: 3, B071RK857H: 3, B01KVIN26O: 1, B01LPZD1N6: 16, B00THKEKEQ: 8};
    let val='B071SF41Y9'
    console.log(savedCart[val]);

    return (
        <div>
            <h1>Hello, This is manage inventory Route</h1>
        </div>
    );
};

export default Inventory;