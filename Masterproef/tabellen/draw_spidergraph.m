function [] = htmobiel()

gemeenschap = csvread('gemeenschap.csv',6,2)
prod = csvread('productiviteit.csv',3,2).^-1
gebruik = csvread('gebruik-matlab.csv',14,2)
ond = csvread('ondersteuning.csv',9,2)
perf = csvread('performantie.csv',5,1).^-1

maxima = [max(gemeenschap),max(prod),max(gebruik),max(ond),max(perf)]';
minima = [min(gemeenschap),min(prod),min(gebruik),min(ond),min(perf)]';
diff = maxima-minima;
format long
%M = cat(1,(gemeenschap-repmat(minima(1),1,4))./diff(1), prod./maxima(2),gebruik./maxima(3),ond./maxima(4),perf./maxima(5));
M = cat(1,gemeenschap./maxima(1),prod./maxima(2),gebruik./maxima(3),ond./maxima(4),perf./maxima(5));
%jqm,st,lungo,kendo => st,kendo,jqm,lungo
%swap kolom i met j:  A = A(:,[1:i-1,j,i+1:j-1,i,j+1:end])
%swap jqm(1) en st(2) => st,jqm,lungo,kendo
M = M(:,[1:1-1,2,1+1:2-1,1,2+1:end]);
%swap jqm(2) en kendo(4) => st,kendo,lungo,jqm
M = M(:,[1:2-1,4,2+1:4-1,2,4+1:end]);
%swap lungo(3) en jqm(4)
M = M(:,[1:3-1,4,3+1:4-1,3,4+1:end])
figure; clf; set(gcf,'color','w'); s = zeros(1,4);
s(1) = subplot(1,1,1);
plot = spider(M,'Spiderweb HTML5 raamwerken',[],{'Gemeenschap' ''; 'Productiviteit' ''; 'Gebruik' '';'Ondersteuning' '';'Performantie' ''},{'Sencha Touch' 'Kendo UI' 'jQuery Mobile' 'Lungo' },s(1));
saveas(plot,'../figuren/spidergraph.pdf');
system('pdfcrop ../figuren/spidergraph.pdf ../figuren/spidergraph.pdf');
