mocha.setup({ checkLeaks: true, reporter: MochaBar, ui: 'ebdd' });
addEventListener
(
    'DOMContentLoaded',
    (): void =>
    {
        mocha.run();
    },
);
