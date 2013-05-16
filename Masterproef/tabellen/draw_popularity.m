function [] = draw_trends()

M = csvread('populariteit-tijd.csv',1,1);
newData1 = importdata('populariteit-tijd.csv');

% Create new variables in the base workspace from those fields.
vars = fieldnames(newData1);
for i = 1:length(vars)
    assignin('base', vars{i}, newData1.(vars{i}));
end

%%%%%%%%%%
col = [	1 64/255 38/255 %st=rood
        85/255 156/255 57/255 %kendo=groen
        0 71/255 129/255 %jqm = blauw
        1 209/255 81/255 %lungo=geel
        ];

%%%%%%%%%%%

%switch columns (jqm, st, kendo, lungo) -> (st,kendo,jqm,lungo)
M(:,[1 2 3 4]) = M(:,[2 4 1 3]);

%cut off laatste drie rijen
M = M(1:end-3,:);


figure;
o = plot(M);
hold on;
for ii = 1:4; set(o(ii),'color',col(ii,:),'linewidth',1.25); end
legend('Sencha Touch', 'Kendo UI', 'jQuery Mobile', 'Lungo','Location','NorthWest');
xlabel('Tijd')
ylabel('Populariteit');
%set(gca,'XTickLabel',months);
%set(gca,'XLim',[0 297])
%rotateticklabel(gca,90);
saveas(gca,'../figuren/populariteit-tijd.pdf');
system('pdfcrop ../figuren/populariteit-tijd.pdf ../figuren/populariteit-tijd.pdf');